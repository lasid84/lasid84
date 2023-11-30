class DataContainer {
    constructor() {
      // Properties for numeric, text, and cursor data
      this.numericData = 0; // Default value for numeric data is 0 (you can change it as needed)
      this.textData = ''; // Default value for text data is an empty string
      this.cursorData = null; // Default value for cursor data is null (no data initially)
    }
  
    // Methods to set values for numeric, text, and cursor data
    setNumericData(data) {
      this.numericData = data;
    }
  
    setTextData(data) {
      this.textData = data;
    }
  
    setCursorData(data) {
      this.cursorData = data;
    }
  
    // Methods to get values for numeric, text, and cursor data
    getNumericData() {
      return this.numericData;
    }
  
    getTextData() {
      return this.textData;
    }
  
    getCursorData() {
      return this.cursorData;
    }
  }
  
//   // Example usage:
//   const dataContainer = new DataContainer();
//   dataContainer.setNumericData(42);
//   dataContainer.setTextData('Hello, world!');
//   dataContainer.setCursorData([/* Cursor data as an array */]);
  
//   console.log('Numeric Data:', dataContainer.getNumericData());
//   console.log('Text Data:', dataContainer.getTextData());
//   console.log('Cursor Data:', dataContainer.getCursorData());
module.exports = DataContainer;  
