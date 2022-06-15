const fs = require('fs');
const path = require('path');
const glob = require('glob');
const Handlebars = require('handlebars');

function loadFiles(filesPath, load = () => { }) {
  const files = glob.sync(filesPath);
  for (const file of files) {
    const extname = path.extname(file);
    const fileName = path.basename(path.basename(file), extname);
    load({ file, extname, fileName });
  }
}

function loadPartials(partialsPath, handlebars = Handlebars, partialRegistered = () => { }) {
  loadFiles(partialsPath, ({ file, extname, fileName }) => {
    if (extname !== '.hbs') return;
    const partial = fs.readFileSync(file).toString();
    handlebars.registerPartial(fileName, partial);
    partialRegistered({ file, extname, fileName });
  });
  return handlebars;
}

function registerHelper(name, helper, handlebars) {
  const helperType = typeof helper;
  if (helperType === 'function') {
    return handlebars.registerHelper(name, helper);
  }
  if (helperType === 'object' && !Array.isArray(helper)) {
    Object.entries(helper).forEach(([name, helper]) => {
      return handlebars.registerHelper(name, helper);
    });
  }
}

function loadHelpers(helpersPath, handlebars = Handlebars, helperRegistered = () => { }) {
  loadFiles(helpersPath, ({ file, extname, fileName }) => {
    if (extname !== '.js') return;
    const helper = require(path.resolve(file));
    registerHelper(fileName, helper, handlebars);
    helperRegistered({ file, extname, fileName });
  });
  return handlebars;
}

function loadHandlebars({ partials, partialRegistered, helpers, helperRegistered }, handlebars = Handlebars) {
  loadPartials(partials, handlebars, partialRegistered);
  loadHelpers(helpers, handlebars, helperRegistered);
  return handlebars;
}

function compileFile(filePath, handlebars = Handlebars) {
  return handlebars.compile(fs.readFileSync(filePath).toString());
}

module.exports = {
  loadPartials,
  loadHelpers,
  loadHandlebars,
  compileFile
};
