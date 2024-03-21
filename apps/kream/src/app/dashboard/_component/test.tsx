import React, { useEffect, useRef, useState } from 'react';
// import './CustomSelect.css'; // CSS 파일을 임포트합니다.
import Grid, { gridData, onRowClicked } from '@/components/grid/ag-grid-enterprise';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { RowClickedEvent } from 'ag-grid-community';
// import { gridData } from 'components/grid/ag-grid-enterprise';
// import Grid, { isFirstColumn, getFirstColumn, onGridRowAdd, onCellValueChanged, onSelectionChanged, onRowClicked, gridData } from 'components/grid/ag-grid-enterprise';

const { log } = require('@repo/kwe-lib/components/logHelper');

function CustomSelect() {
    const [isOpen, setIsOpen] = useState(false); // 컴포넌트 상태를 사용하여 셀렉트 옵션의 가시성을 관리합니다.
    const ref = useRef<HTMLDivElement>(null);
    const gridRef = useRef<any | null>(null);
    const data = {
    data : [{
      cust_code:'1',
      cust_name:'1이름',
      bz_reg_no:'1사업자'
    },
    {
      cust_code:'2',
      cust_name:'2이름',
      bz_reg_no:'2사업자'
    },
    {
      cust_code:'3',
      cust_name:'3이름',
      bz_reg_no:'3사업자'
    },
  ],
    fields : [{
        name: 'cust_code',
        tableID: 88746,
        columnID: 1,
        dataTypeID: 25,
        dataTypeSize: -1,
        dataTypeModifier: -1,
        format: 'text'
      },
      {
        name: 'cust_name',
        tableID: 88746,
        columnID: 1,
        dataTypeID: 25,
        dataTypeSize: -1,
        dataTypeModifier: -1,
        format: 'text'
      },
      {
        name: 'bz_reg_no',
        tableID: 88746,
        columnID: 1,
        dataTypeID: 25,
        dataTypeSize: -1,
        dataTypeModifier: -1,
        format: 'text'
      }
    ]
    }

    const [displayText, setDisplayText] = useState('Select an option');

  // 옵션을 토글하는 함수
  const toggleOptions = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    // 컴포넌트가 마운트 되었을때만
    const handleClickOutside = (event: MouseEvent) => {
      log("handleClickOutside", )
      // if (ref.current && !ref.current.contains(event.target as Node)) {
      if (ref.current && !ref.current.contains(event.target as Node) && !((event.target as HTMLElement).closest('.custom-select'))) {
        setIsOpen(false);
      }
    };

    // 외부 클릭 이벤트 리스너 추가
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // 컴포넌트가 언마운트 될때 클릭 이벤트 리스너 제거
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handelRowClicked = (param:RowClickedEvent) => {
    var val = onRowClicked(param);
    log("handelRowClicked", val);
    setDisplayText(val.cust_name);    
    if (val) toggleOptions();
  }

  const test = () => {
    log("handelRowClicked");
  }

  return (
    <>
      <div 
        ref={ref}
        className="custom-select-container"
        style={{position: 'relative'}}
      >
        <div className={`custom-select ${isOpen ? 'active' : ''}`} 
            onClick={toggleOptions} 
            style={{
              width:'250px', 
              position: 'relative',
              cursor: 'pointer',
              backgroundColor: '#fff',
              border: '1px solid #ccc'
            }}
            >
          {displayText}
          {/* <div className="arrow">&#9662;</div> */}
          <div className="arrow"
          style={{
              position: 'absolute',
              top: '50%',
              right: '10px',
              transform: 'translateY(-50%)',
              cursor: 'pointer',
              }}
          >
            {isOpen ? <FaChevronUp className="arrow-icon" /> : <FaChevronDown className="arrow-icon" />}
          </div>
        </div>
        {isOpen && 
            <div className="absolute left-0 flex bg-opacity-50 top-5 items" style={{width:"500px", height:"200px"}}>
              <Grid
                  gridRef={gridRef}
                  listItem={data as gridData}
                  // options={gridOptions}
                  event={{
                      //  onCellValueChanged: handleCellValueChanged,
                      //  onSelectionChanged: handleSelectionChanged
                      onRowClicked: handelRowClicked
                  }}
                  />
            </div>
            }
      </div>
    </>
  );
}

export default CustomSelect;


// import React, { useState } from 'react';
// import './CustomSelect.css';

// const CustomSelect = () => {
//   const [isOpen, setIsOpen] = useState(false);

//   const toggleOptions = () => {
//     setIsOpen(!isOpen);
//   };

//   return (
//     <div className="custom-select-container">
//        <div className={`custom-select ${isOpen ? 'active' : ''}`} onClick={toggleOptions}>
//         Select an option
//         <div className="arrow">&#9662;</div>
//       </div>
//       {isOpen && (
//         <div className="custom-options">
//           {/* 내가 만든 컴포넌트 */}
//             <div>Option 1</div>
//             <div>Option 2</div>
//             <div>Option 3</div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CustomSelect;

