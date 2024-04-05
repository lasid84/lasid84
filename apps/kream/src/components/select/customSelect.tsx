import React, { memo, useEffect, useLayoutEffect, useRef, useState, useTransition } from 'react';
import Grid, { GridOption, gridData } from '@/components/grid/ag-grid-enterprise';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { IRowNode, RowClickedEvent } from 'ag-grid-community';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import { Label } from 'components/label';

const { log } = require('@repo/kwe-lib/components/logHelper');

type Props = {
  id: string              // 식별값, valueCol 사용시 의미 없음
  label?:string           // 컴포넌트 라벨, null 시 id 값으로 표시
  listItem?: gridData     // 메인 데이터
  displayCol?: string     // row 선택시 select 컴포넌트에 보여줄 컬럼
  valueCol?: any[]        // row 선택시 formProvider에 저장할 컬럼, null시 id 값으로 저장
  gridOption?: GridOption // 
  gridStyle?: GridStyle
  style?:Style
  isNoSelect?:boolean     // 초기 렌더시 첫번째값 선택 여부
  defaultValue?: string   // 기본값, 설정시 isNoSelect는 무시
  inline?:boolean
}

type GridStyle = {
  width?: string
  height?: string
}

type Style = {
  width?: string
}

function CustomSelect(props:Props) {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const ref2 = useRef<HTMLDivElement>(null);
    const gridRef = useRef<any | null>(null);

    let initText = 'Select an option';
    const [displayText, setDisplayText] = useState(initText);
    // const [isReady, setIsReady] = useState(false);

    const { register, setValue, getValues } = useFormContext();
    const { id, label, listItem, inline, valueCol, displayCol, gridOption, gridStyle, style, isNoSelect } = props;
    const defaultStyle = {
      width : '200px',
      ...style
    }
    const defaultGridStyle = {
      width: '400px',
      height: '300px',
      zIndex: 99,
      ...gridStyle
    }

    // 옵션을 토글하는 함수
    const toggleOptions = () => {
      setIsOpen(!isOpen);
    };

    // useLayoutEffect(() => {
    //   log("useLayoutEffect", isOpen)
    //   setIsOpen(false);
    // }, []);

    useEffect(() => {
      // if (gridRef.current && !isNoSelect) {
      //   gridRef.current.api.forEachNode((node:IRowNode, i:number) => {
      //     if (i === 0) {
      //       node.setSelected(true);
      //       log("customeSelect isReady", gridRef.current, node);
            
      //       gridRef.current.api.dispatchGridEvent({
      //         type: 'rowClicked',
      //         event: null,
      //         rowIndex: node.rowIndex,
      //         rowPinned: null,
      //         context: null,
      //         api: gridRef.current.api,
      //         columnApi: gridRef.current.getColumnApi(),
      //       });



      //     }
      //   })
      // }
      if (!isNoSelect && listItem?.data) {
        if (displayText === initText) {
          var row = listItem.data[0];
          var val = displayCol ? row[displayCol] : row[Object.keys(row)[0]];
          log("==================", row, val, displayCol, row[0], displayText, initText);
          setDisplayText(val);
          setSelectedValue(row)
        };
      }
    }, [listItem])

    useEffect(() => {
      // 컴포넌트가 마운트 되었을때만
      const handleClickOutside = (event: MouseEvent) => {
        if (ref.current && !ref.current.contains(event.target as Node) && ref2.current && !ref2.current.contains(event.target as Node)) {
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
      var selectedRow = {"colId": param.node.id, ...param.node.data}
      log("handelRowClicked", param);
      var val = displayCol ? selectedRow[displayCol] : selectedRow[Object.keys(selectedRow)[0]];
      setDisplayText(val);
      setSelectedValue(selectedRow);
      toggleOptions();
    }

    const handleOnGridReady = (param:any) => {
      log("handleOnGridReady");
      // onGridReady(param);
      // setIsReady(true);
    }

    const setSelectedValue = (row: any) => {
      if (valueCol) valueCol.map(key => setValue(key, row[key]));
      else Object.keys(row).map(key => setValue(key, row[key]));

      log("setSelectedValue", valueCol, row, getValues())
    }

  return (
    <>
      <div        
        {...register(id)}
        className="flex items-center space-x-2 justify-items-start custom-select-container"
        style={{position: 'relative'}}
      >
        <Label id={id} name={label}/>
        {/* {label? t(label) : t(id)} */}
        <div ref={ref}
            className={`custom-select ${isOpen ? 'active' : ''}`} 
            onClick={toggleOptions} 
            style={{
              width: defaultStyle.width, 
              height: "30px",
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
            <div ref={ref2} 
                className="absolute left-0 flex bg-opacity-50 top-10" 
                style={{...defaultGridStyle}}
              >
              <Grid
                  gridRef={gridRef}
                  listItem={listItem}
                  options={{...gridOption, gridHeight:defaultGridStyle.height, isNoSelect:isNoSelect}}
                  event={{
                      //  onCellValueChanged: handleCellValueChanged,
                      //  onSelectionChanged: handleSelectionChanged
                      onRowClicked: handelRowClicked,
                      onGridReady: handleOnGridReady
                  }}
                  />
            </div>
            }
      </div>
    </>
  );
}

export default memo(CustomSelect);
