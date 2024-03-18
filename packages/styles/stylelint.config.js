const path = require('path');

module.exports = {
    configBasedir: path.resolve(__dirname, 'styles'),
    plugins: [
        require('stylelint-scss')
    ],
    // Other configuration...
};