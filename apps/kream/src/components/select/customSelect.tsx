import React, { KeyboardEventHandler, memo, useEffect, useLayoutEffect, useRef, useState, useTransition } from 'react';
import Grid, { GridOption, gridData } from '@/components/grid/ag-grid-enterprise';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { IoMdClose } from "react-icons/io";
import { CellKeyDownEvent, FullWidthCellKeyDownEvent, IRowNode, RowClickedEvent } from 'ag-grid-community';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import { Label } from 'components/label';
import './custom-select-style.css';
import { MaskedInputField } from 'components/input';


const { log } = require('@repo/kwe-lib/components/logHelper');

type Props = {
  id: string              // 식별값, valueCol 사용시 의미 없음
  initText: string           //initText..
  label?: string           // 컴포넌트 라벨, null 시 id 값으로 표시
  listItem?: gridData     // 메인 데이터
  displayCol?: string     // row 선택시 select 컴포넌트에 보여줄 컬럼
  valueCol?: any[]        // row 선택시 formProvider에 저장할 컬럼, null시 id 값으로 저장
  gridOption?: GridOption // 
  gridStyle?: GridStyle
  style?: Style
  isSelectRowAfterRender?: boolean     // 초기 렌더시 첫번째값 선택 여부
  defaultValue?: string   // 기본값, 설정시 isNoSelect는 무시
  inline?: boolean
  isDisplay?: boolean
  isDisplayX?: boolean    // X 아이콘 표시여부(필수값 여부)
}

type GridStyle = {
  width?: string
  height?: string
}

type Style = {
  width?: string
  height?: string
}

function CustomSelect(props: Props) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isGridReady, setIsGridReady] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const ref2 = useRef<HTMLDivElement>(null);
  const gridRef = useRef<any | null>(null);
  const inputRef = useRef<any | null>(null);
  // const [isReady, setIsReady] = useState(false);
  const { register, setValue, getValues } = useFormContext();
  const { id, label, initText = 'Select an Option', listItem, inline = false, valueCol, displayCol, gridOption, gridStyle, style, isSelectRowAfterRender, isDisplay, isDisplayX = true } = props;
  const customselect = true
  const defaultStyle = {
    width: '200px',
    ...style
  }
  const defaultGridStyle = {
    width: '400px',
    height: '300px',
    zIndex: 99,
    ...gridStyle
  }

  const inline_style = inline ? 'flex-row' : 'flex' 

  //let initText = 'Select an option';
  const [displayText, setDisplayText] = useState(initText);
  const [filteredData, setFilteredData] = useState(listItem);

  // 옵션을 토글하는 함수
  const toggleOptions = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsGridReady(false);
      
    }

  };

  useEffect(() => {
    if (!filteredData) {
      setFilteredData(listItem);
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

  useEffect(() => {
    if (isOpen && isGridReady) {
      var param = getValues();
      if (valueCol?.some(v => param[v])) {
        for (var i = 0; i < filteredData?.data.length; i++) {
          if (valueCol?.every(v => param[v] === filteredData?.data[i][v])) break;
        }
        gridRef.current?.api?.setFocusedCell(i, id);
      }
    }
  }, [isOpen, isGridReady])

  const handelRowClicked = (param: RowClickedEvent) => {
    var selectedRow = { "colId": param.node.id, ...param.node.data }
    log("handelRowClicked", param);
    setSelectedValue(selectedRow);
    setDisplayVal(selectedRow);
  }

  const handleOnGridReady = (param: any) => {
    // const gridApi = param.api;
    // // const gridElement = gridApi.gridCore.eGridDiv; // AG Grid의 최상위 DOM 요소에 접근
    // const gridCore = gridApi.gridCore;
    // log("handleOnGridReady", gridApi, gridCore);
  }

  const handleComponentStateChanged = (param: any) => {
    log("handleComponentStateChanged");
    setIsGridReady(true);
    // onGridReady(param);
    // setIsReady(true);
  }

  const setSelectedValue = (row: any) => {
    log("setSelectedValue", valueCol, row)
    if (valueCol) valueCol.map(key => setValue(key, row[key]));
    else Object.keys(row).map(key => setValue(key, row[key]));

    // log("setSelectedValue", valueCol, row, getValues())
    toggleOptions();
  }

  const setDisplayVal = (row: any) => {
    var val = initText;
    if (row) {
      val = displayCol ? row[displayCol] : row[Object.keys(row)[0]];
    }
    setDisplayText(val);
  }

  const handleXClick = (e: any) => {
    setDisplayText(initText);
    setSelectedValue('');
    setFilteredData(listItem);
    setIsOpen(false);
  }

  const handleCellKeyDown = (e: CellKeyDownEvent | FullWidthCellKeyDownEvent) => {
    const keyboardEvent = e.event as unknown as KeyboardEvent;
    const key = keyboardEvent.key;
    if (key.length) {
      switch (key) {
        case "Enter":
          let selectedRow = e.data; //gridRef.current.api.getSelectedRows()[0];
          setSelectedValue(selectedRow);
          setDisplayVal(selectedRow);
          moveNextComponent();
          // const form = document.querySelector('form');
          // const gridApi = gridRef.current.api;
          // const gridElement = gridApi.gridCore.eGridDiv;
          // log("handleCellKeyDown8", selectedRow, gridElement);
          break;
      }
    }
  }

  const handleCustChange = (input: string) => {

    let inputVal = input.toString().toUpperCase();
    log("MaskedInputField onChange", inputVal);
    if (!inputVal || inputVal === initText) {
      setFilteredData(listItem);
      return;
    }
    let visible = gridOption?.colVisible?.visible;
    let filterCols = listItem?.fields.map((obj: { [x: string]: any; }) => obj["name"])
      .filter((val: string) => {
        if (visible) return gridOption?.colVisible?.col.includes(val);
        else return !gridOption?.colVisible?.col.includes(val);
      });

    var filtered = {
      fields: [...listItem?.fields],
      data: [...listItem?.data.filter((d: { [x: string]: any; }) => {
        let bool = false;
        for (let i = 0; i < filterCols.length; i++) {
          let col = filterCols[i];
          // log("filtered", col,d,d[col]);
          if (d[col] && d[col].toUpperCase().includes(inputVal)) {
            bool = true;
            break;
          }
        }
        return bool;
      })]
    };

    setFilteredData(filtered);
  }

  const moveNextComponent = () => {

    const formElement = document.querySelector('form'); // 예시로 폼 요소를 선택합니다.
    const inputElement = document.querySelector(`#${id}`);
    if (formElement && inputElement) {
      const elementsArray = Array.from(formElement.elements).filter(v => !v.className.includes("ag-input-field-input") && !v.className.includes("ag-button"));
      const gridIndex = elementsArray.indexOf(inputElement);
      if (gridIndex !== -1 && gridIndex < elementsArray.length - 1) {
        const nextElement = elementsArray[gridIndex + 1];
        // 다음 요소에 포커스를 설정하거나 원하는 작업을 수행할 수 있습니다.
        if (nextElement instanceof HTMLElement) {
          nextElement.focus();
        }
      }
    }
  };

  return (
    <>
      <div
        // {...register(id)}
        className={`w-full py-0.5 ${inline_style} items-center space-x-2 justify-items-start custom-select-container dark:bg-gray-900 dark:text-white dark:border-gray-700`}
        style={{ position: 'relative' }}
      >
        <Label id={id} name={label} isDisplay={isDisplay} />

        <div ref={ref}
          className={`custom-select ${isOpen ? 'active' : ''} w-full`}
          onClick={toggleOptions}
          style={{
            width: defaultStyle.width,
            height: "30px",
            // position: 'relative',
            cursor: 'pointer',
            // border: '1px solid #ccc'
          }}
        >
          <MaskedInputField id={id} value={displayText} options={{ textAlign: 'center', noLabel: true, isNotManageSetValue:true }} height='h-8' 
            events={{
              onChange(e) {
                e.preventDefault();
                if (!isOpen) setIsOpen(true);
                handleCustChange(e.target.value);
              },
              onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
                if (!isOpen) setIsOpen(true);
                switch (e.key) {
                  case "ArrowUp":
                  case "ArrowDown":
                    // ref2?.current?.focus();
                    e.preventDefault();
                    log("onKeyDown", id, gridRef, gridRef.current);
                    gridRef.current.api.setFocusedCell(0, valueCol![0]);

                    break;
                }
              },
              onFocus(e) {
                log("=====onFocus")
                e.target.select();
              },
            }}
          />
          {/* {displayText} */}
          <div className="arrow"
            style={{
              position: 'absolute',
              top: '50%',
              right: '10px',
              transform: inline ? 'translateY(-10%)' : 'translateY(-50%)',
              cursor: 'pointer',
            }}
            onClick={() => {
              const inputElement = document.querySelector(`#${id}`);
              if (inputElement instanceof HTMLElement) inputElement.focus();
            }}
          >
            {isOpen ? <FaChevronUp className="arrow-icon" /> : <FaChevronDown className="arrow-icon" />}
          </div>
        </div>
        {isDisplayX ? <div className='close'
          style={{
            position: 'absolute',
            top: '50%',
            right: '30px',
            transform: inline ? 'translateY(-10%)' : 'translateY(-50%)',
            cursor: 'pointer',
          }}
          onClick={handleXClick}
        ><IoMdClose /></div>
        : <></>
        }
        {isOpen &&
          <div ref={ref2}
            className="py-0.5 absolute left-0 flex bg-opacity-50 top-10"
            style={{ ...defaultGridStyle }}
          >
            <Grid
              customselect={customselect}
              gridRef={gridRef}
              listItem={filteredData}
              options={{ ...gridOption, gridHeight: defaultGridStyle.height, isSelectRowAfterRender: isSelectRowAfterRender }}
              event={{
                //  onCellValueChanged: handleCellValueChanged,
                //  onSelectionChanged: handleSelectionChanged
                onRowClicked: handelRowClicked,
                onGridReady: handleOnGridReady,
                onCellKeyDown: handleCellKeyDown,
                onComponentStateChanged: handleComponentStateChanged
              }}
            />
          </div>
        }
      </div>
    </>
  );
}

export default memo(CustomSelect);
