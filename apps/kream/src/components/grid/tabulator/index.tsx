import 'react-tabulator/lib/styles.css';
import "tabulator-tables/dist/css/tabulator.min.css"; 
import { ReactTabulator, ColumnDefinition, ReactTabulatorOptions } from 'react-tabulator';
// import DateEditor from './editors/DateEditor';
// import MultiSelectEditor from './editors/MultiSelectEditor';
// import MultiValueFormatter from './formatters/MultiValueFormatter';
// import { reactFormatter } from './Utils';
import { useRef, useState } from 'react';


function SimpleButton(props: any) {
  const rowData = props.cell._cell.row.data;
  const cellValue = props.cell._cell.value || 'Edit | Show';
  return <button onClick={() => alert(rowData.name)}>{cellValue}</button>;
}

const columns: ColumnDefinition[] = [
  { title: "Name", field: "name", width: 150, headerFilter:"input" },
  { title: "Age", field: "age", hozAlign: "left", formatter: "progress", headerFilter:"input" },
  { title: "Favourite Color", field: "col" },
  { title: "Date Of Birth", field: "dob", hozAlign: "center" },
  { title: "Rating", field: "rating", hozAlign: "center", formatter: "star" },
  { title: "Passed?", field: "passed", hozAlign: "center", formatter: "tickCross" }
];
  var data = [
    {id:1, name:"Oli Bob", age:"12", col:"red", dob:""},
    {id:2, name:"Mary May", age:"1", col:"blue", dob:"14/05/1982"},
    {id:3, name:"Christine Lobowski", age:"42", col:"green", dob:"22/05/1982"},
    {id:4, name:"Brendon Philips", age:"125", col:"orange", dob:"01/08/1980"},
    {id:5, name:"Margret Marmajuke", age:"16", col:"yellow", dob:"31/01/1999"},
  ];

  // Editable Example:
const colorOptions = { ['']: '&nbsp;', red: 'red', green: 'green', yellow: 'yellow' };
const petOptions = [
  { id: 'cat', name: 'cat' },
  { id: 'dog', name: 'dog' },
  { id: 'fish', name: 'fish' }
];
// const editableColumns: any[] = [
//   { title: 'Name', field: 'name', width: 150, editor: 'input', headerFilter: 'input' },
//   { title: 'Age', field: 'age', hozAlign: 'left', formatter: 'progress', editor: 'star' },
//   {
//     title: 'Favourite Color',
//     field: 'color',
//     editor: 'select',
//     editorParams: { allowEmpty: true, showListOnEmpty: true, values: colorOptions },
//     headerFilter: 'select',
//     headerFilterParams: { values: colorOptions }
//   },
//   { title: 'Date Of Birth', field: 'dob', editor: DateEditor, editorParams: { format: 'MM/DD/YYYY' } },
//   {
//     title: 'Pets',
//     field: 'pets',
//     sorter: (a: string[], b: string[]) => a.toString().localeCompare(b.toString()),
//     editor: MultiSelectEditor,
//     editorParams: { values: petOptions },
//     formatter: MultiValueFormatter,
//     formatterParams: { style: 'PILL' }
//   },
//   { title: 'Passed?', field: 'passed', hozAlign: 'center', formatter: 'tickCross', editor: true }
// ];

export default () => {
  const [state, setState] = useState<any>({
    data: [],
    selectedName: ''
  });
  let ref = useRef<any>();

  const rowClick = (e: any, row: any) => {
    console.log('ref table: ', ref.current); // this is the Tabulator table instance
    // ref?.current && ref?.current.replaceData([])
    console.log('rowClick id: ${row.getData().id}', row, e);
    setState({ selectedName: row.getData().name });
  };

  const options: ReactTabulatorOptions = {
    height: 150,
    movableRows: true,
    movableColumns: true
  }; 

  return (
    <>
    <br></br>
    <div className="text-lg text-5xl font-bold">
      Tabulator
      <br></br>
        장점 : 기본으로는 3중 제일 나은듯
        <br></br>
        단점 : 커스텀하기 어려움 / 공식 레퍼런스가 js 뿐이 없음
      </div>
    <ReactTabulator
        // onRef={(r) => (ref = r)}
        columns={columns}
        // options={options}
        data={data}
        layout={"fitData"}
        // events={{rowClick: rowClick}}
        />
    </>        
  )

}


