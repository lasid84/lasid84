import React, { ChangeEvent, forwardRef, KeyboardEventHandler, memo, useEffect, useLayoutEffect, useRef, useState, useTransition } from 'react';
import Grid, { GridOption, gridData } from '@/components/grid/ag-grid-enterprise';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { IoMdClose } from "react-icons/io";
import { CellKeyDownEvent, ComponentStateChangedEvent, FullWidthCellKeyDownEvent, IRowNode, RowClickedEvent, SelectionChangedEvent } from 'ag-grid-community';
import { useTranslation } from 'react-i18next';
import {  useAppContext } from "components/provider/contextObjectProvider";
import { useFormContext } from 'react-hook-form';
import { Label } from 'components/label';
import './custom-select-style.css';
import { MaskedInputField } from 'components/input';
import { InputWrapper } from "components/wrapper"


import { log, error } from '@repo/kwe-lib-new';

type Props = {
  id: string              // 식별값, valueCol 사용시 의미 없음
  parentRef?: any;
  initText?: string           //initText..
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
  isDisplay?: boolean       // Controlling the visibility of an element.
  isDisplayX?: boolean    // X 아이콘 표시여부(필수값 여부)
  isReadOnly? :boolean    // ReadOnly?
  noLabel?: boolean       // Label 표시 여부
  lwidth?: string        // Label 넓이
  events?:{               //customselect event전달용
    onChanged?: (e:any) => void;
    onRowClicked?:  (e: ChangeEvent<HTMLInputElement>) => void;
    onSelectionChanged?: (e: SelectionChangedEvent<HTMLInputElement>, id:string, value:string) => void;
    onComponentStateChanged? : (e: ComponentStateChangedEvent<HTMLInputElement>) => void
  }
}

type GridStyle = {
  width?: string
  height?: string
}

type Style = {
  width?: string
  height?: string
}

const useDebounce = (value: any, delay: any) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// function CustomSelect(props: Props) {
const CustomSelect = forwardRef((props: Props, focusRef) => {
  const { dispatch, objState } = useAppContext();
  const { mSelectedRow, selectedobj, isRefresh } = objState

  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isGridReady, setIsGridReady] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const ref2 = useRef<HTMLDivElement>(null);
  const gridRef = useRef<any | null>(null);
  const inputRef = useRef<any | null>(null);
  // const [isReady, setIsReady] = useState(false);
  const [isSearching, setSearching ] = useState(false);
  const { register, setValue, getValues } = useFormContext();
  const { id, label, initText = 'Select an Option', listItem, inline, valueCol, displayCol = id, gridOption, gridStyle, style, isSelectRowAfterRender, isDisplay=true, isDisplayX = true
    , isReadOnly=false,noLabel = false, lwidth, defaultValue:initValue, events
  } = props;
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
  //let initText = 'Select an option';
  const [displayText, setDisplayText] = useState<any>(initText);
  const [filteredData, setFilteredData] = useState(listItem);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  // const [defaultValue, setDefaultValue] = useState<any>(useDebounce(initValue, 200));
  const [defaultValue, setDefaultValue] = useState<any>(initValue);
  const [openDirection, setOpenDirection] = useState('down');

  // 옵션을 토글하는 함수
  const toggleOptions = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsGridReady(false);
    } else {
      // log("close")
    }
  };

  useEffect(() => {
    if (isRefresh) {
      setFilteredData(listItem);
      // handleXClick(null);
    }
  }, [isRefresh])

  useEffect(() => {
      // log("listitem useEffect", listItem)
      setFilteredData(listItem);
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

  // useEffect(() => {
  //   if (id.includes('container_type')) log("useEffect isOpen, isGridReady, selectedRow", selectedRow)
  //   if (isGridReady && selectedRow) {
  //     var param = selectedRow;
  //     if (valueCol?.some(v => param[v])) {
  //       var i = -1;
  //       for (i = 0; i < filteredData?.data.length; i++) {
  //         if (valueCol?.every(v => param[v] === filteredData?.data[i][v])) break;
  //       }
  //       // log('??', valueCol, displayCol, selectedRow, i, filteredData?.data[i]);
  //       if (!gridRef.current) return;
  //       if (i < 0) return;
  //       // gridRef.current.api.ensureIndexVisible(i, 'top');
  //       // 약간의 딜레이 후에 포커스 설정 (렌더링이 완료될 시간을 줌)
  //       setTimeout(() => {
  //         // log("useEffect in customselect ", gridRef.current.api?.getSelectedRows())
  //         gridRef.current?.api?.setFocusedCell(i, /*valueCol[0]*/ displayCol);
  //         if (gridRef.current?.api.getRowNode(i)) gridRef.current?.api.getRowNode(i).setSelected(true);
  //       }, 100);
  //     } else {

  //     }
  //   }
  // }, [isGridReady, selectedRow])

  useEffect(() => {
    if (id.includes('cr_s_cont_seq')) log("useEffect defaultValue, listItem, valueCol", gridRef.current, id, defaultValue, displayText)
    // log("useEffect defaultValue, listItem, valueCol", gridRef.current, id, defaultValue, displayText, isOpen)
    // if (listItem?.data.length) {
      if (!isOpen) {
        if (!defaultValue) {
          // if (gridRef.current) {
          //   gridRef.current.api?.deselectAll();
          //   // gridRef.current.api?.setFocusedCell(null);
          //   // gridRef.current.api.ensureIndexVisible(0);
          // }
          // log("custselect defaultValue null", id, isSearching)
          setSelectedValue(null);
          return;
        }

        let index = -1;
        const initialData = listItem?.data.find((item: any, i:number) => {
          index = i;
          if (valueCol?.length) return item[valueCol![0]] === defaultValue
          else return item[displayCol] === defaultValue
        });

        // if (id.includes('container_type')) log("useffect isOpen",  gridRef.current, index, initialData)

        // if (gridRef.current) {
        //   if (index > -1 && gridRef.current.api && gridRef.current.api.getRowNode(index)) {
        //     gridRef.current.api.setFocusedCell(index, /*valueCol![0]*/displayCol);
        //     gridRef.current.api.getRowNode(index)?.setSelected(true);
        //   }
        // }

        setSelectedValue(initialData);
        // setDisplayVal(initialData);
      // }
      }
  }, [defaultValue, listItem, isOpen])

  useEffect(() => {
    setDefaultValue(initValue);
  }, [initValue])

  // useEffect(() => {
  //   log("useEffect defaultValue, listItem, valueCol")
  //   if (defaultValue && listItem?.data) {
  //     // const initialData = listItem.data.find((item: any) => valueCol?.every(col => item[col] === defaultValue));
  //     let index = -1;
  //     const initialData = listItem.data.find((item: any, i:number) => {
  //       index = i;
  //       return item[valueCol![0]] === defaultValue
  //     });
  //     // log("======", id);
  //     if (initialData) {
  //       // if (index > -1) gridRef.current?.api.getRowNode(index).setSelected(true);
  //       setSelectedValue(initialData, false);
  //       setDisplayVal(initialData);
  //     } else {
  //       if (selectedRow) handleXClick(null);
  //     }
  //   } else if (!defaultValue) {
  //     if (selectedRow) handleXClick(null);
  //   }
  // }, [defaultValue, listItem, valueCol]);

  useEffect(() => {
    // log("useEffect isOpen")
    if (isOpen) {
      const inputElement = ref.current;
      const inputRect = inputElement?.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      if (inputRect?.bottom && inputRect.bottom + Number(defaultGridStyle.height.replace('px','')) > viewportHeight) {
        setOpenDirection('up');
      } else {
        setOpenDirection('down');
      }

      // log("useEffect isOpen getSelectedNodes", gridRef.current?.api.getSelectedNodes());
      if (gridRef.current) {

        if (!defaultValue) {
          // gridRef.current.api.clearFocusedCell(); <- 안먹음
          return;
        }

        var rowIndex = 0;
        if (gridRef.current?.api.getSelectedNodes().length) {
          rowIndex = gridRef.current?.api.getSelectedNodes()[0].rowIndex
          // gridRef.current.api.ensureIndexVisible(rowIndex);
        }

        let i = 0;
        for (; i < filteredData?.data.length; i++) {
          if (filteredData && filteredData.data[i][valueCol![0]] === defaultValue) break;
        }
        
        if (rowIndex !== i && gridRef.current?.api.getRowNode(i)) {
          // gridRef.current.api.clearFocusedCell();
          // log("=============isOpen", id, rowIndex, i)
          // gridRef.current.api.setFocusedCell(i, /*valueCol![0]*/displayCol);
          gridRef.current.api.getRowNode(i).setSelected(true);
        }
      }
    }
  }, [isOpen]);

  useEffect(() => {
    onChange(selectedRow);
  }, [selectedRow])

  // useEffect(() => {
  //   log("useEffect fileteredData" , gridRef.current?.api?.getRowNode(0), gridRef.current?.api?.getSelectedRows());
  //   if (isOpen && gridRef.current && filteredData?.data.length && gridRef.current?.api?.getRowNode(0) && !gridRef.current?.api?.getSelectedRows().length) {
  //     gridRef.current?.api?.getRowNode(0).setSelected(true);
  //   }
  // }, [filteredData, gridRef.current])

  const onChange = (row:any) => {
    let event = {
      ...row,
      id: id
    }
    if (events?.onChanged) events.onChanged(event);
  }

  const handelRowClicked = (param: any) => {
    var selectedRow = { "colId": param.node.id, ...param.node.data }
    gridRef.current.api.getRowNode(param.node.id).setSelected(true);
    // log("==selectedRow", selectedRow)
    toggleOptions();
    setSelectedValue(selectedRow);
    // setDisplayVal(selectedRow);
    if(events?.onRowClicked){    
      events?.onRowClicked(selectedRow);
    }
  }

  const handleSelectionChanged = (param: SelectionChangedEvent) => {
    var selectedRow = param.api.getSelectedRows()[0];
    // log("handleSelectionChanged", param)
    let val = selectedRow ? selectedRow[valueCol![0]] : null;
    if(events?.onSelectionChanged){    
      events?.onSelectionChanged(param, id, val);
    }
    setDefaultValue(val);
    // if (selectedRow) setSearching(false);
  }

  const handleOnGridReady = (param: any) => {
    setIsGridReady(true);
    // log("handleOnGridReady", id, param, defaultValue);
    // const initialData = listItem.data.find((item: any) => valueCol?.every(col => item[col] === defaultValue));
  }

  const handleComponentStateChanged = (param: any) => {
    // log("handleComponentStateChanged");
    // onGridReady(param);
    // setIsReady(true);
    if (events?.onComponentStateChanged) events.onComponentStateChanged(param);
  }

  const setSelectedValue = (row: any, toggle = true) => {
    
    if (valueCol) {
      valueCol.map((key,i) => {
        let val = (row && row[key]) ? row[key] : null;
        if (i === 0) setValue(id, val);
        // log("setSelectedValue", id, val, row);
        //거래처 관리 main_cust_code 쪽 문제가 됨(cust_code에 main_cust_code가 표시됨으로 아래 주석)
        // setValue(key, val);
      });
    }
    else Object.keys(row || {}).map(key => setValue(key, row[key] ? row[key] : null));

    setSelectedRow(row);
    setDisplayVal(row);
    // if (toggle) toggleOptions();
  }

  const setDisplayVal = (row: any | null) => {
    // log("setDisplayVal");

    if (row === undefined) return;

    var val = null;
    if (row) {
      val = displayCol ? row[displayCol] : row[Object.keys(row)[0]];
    }

    setDisplayText(val);
    // log("setDisplayVal", displayCol, val, row, displayText)
    
  }

  const handleXClick = (e: any) => {
    // log("handleXClick", gridRef, gridRef.current, selectedRow)
    if (selectedRow && gridRef.current && gridRef.current.api?.getSelectedRows()) gridRef.current.api.deselectAll();

    setSelectedValue(null);
    // setDisplayVal(null);
    setFilteredData(listItem);

    setIsOpen(false);
  }

  const handleCellKeyDown = (e: CellKeyDownEvent | FullWidthCellKeyDownEvent) => {
    // log("handleCellKeyDown")
    const keyboardEvent = e.event as unknown as KeyboardEvent;
    const key = keyboardEvent.key;    
    if (key.length) {
      switch (key) {
        case "Enter":
          let selectedRow = e.data; //gridRef.current.api.getSelectedRows()[0];
          // log(selectedRow);
          setSelectedValue(selectedRow);
          setIsOpen(false);
          // moveNextComponent();
          break;
      }
    }
  }

  const handleCellValueChanged = () => {
    // log("handleCellValueChanged")
  }

  const handleCustChange = (input: string) => {

    let inputVal = input.toString().toUpperCase();
    // log("MaskedInputField onChange", inputVal);
    if (!inputVal || inputVal === initText) {
      setFilteredData(listItem);
      return;
    }
    setDisplayText(input);
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
    // log("MaskedInputField onChange2", inputVal, filtered);
    setFilteredData(filtered);
    // if (inputVal) setSearching(true);
    // else setSearching(false);
  }

  const moveNextComponent = () => {
    // const formElement = document.querySelector('form'); // 예시로 폼 요소를 선택합니다.
    const inputElement = document.querySelector(`#${id}`) as HTMLInputElement | null;
    const formElement = inputElement?.closest('form') as HTMLFormElement | null; 
    // log("moveNextComponent", formElement, inputElement, inputElement?.closest('form'));
    if (formElement && inputElement) {
      const elementsArray = Array.from(formElement.elements)
                              .filter((v): v is HTMLInputElement | HTMLTextAreaElement => 
                                v instanceof HTMLInputElement || 
                                v instanceof HTMLTextAreaElement
                              )
                              .filter(v => !v.className.includes("ag-input-field-input") 
                                        && !v.className.includes("ag-button") 
                                        && !(v instanceof HTMLButtonElement) 
                                        && !(v instanceof HTMLFieldSetElement)
                                        && !(v.readOnly)
                                      );

      const currIndex = elementsArray.indexOf(inputElement);
      // log("moveNextComponent",elementsArray, currIndex)
      if (currIndex !== -1 && currIndex < elementsArray.length - 1) {
        const nextElement = elementsArray[currIndex + 1];
        // 다음 요소에 포커스를 설정하거나 원하는 작업을 수행할 수 있습니다.
        if (nextElement instanceof HTMLElement) {
          nextElement.focus();
        }
      }
    }
  };

  // useEffect(()=> {
  //   log("displayText", displayText)
  // }, [displayText]);

  return (
    <>
      {/* <div
        // {...register(id)}
        className={`w-full py-0.5 ${inline_style} items-center space-x-2 justify-items-start custom-select-container dark:bg-gray-900 dark:text-white dark:border-gray-700`}
        style={{ position: 'relative' }}
      >
        <Label id={id} name={label} isDisplay={isDisplay} /> */}
      <InputWrapper outerClassName={`w-full relative ${isDisplay ? '' : 'invisible'}`} inline={inline}>
      {/* <div className="relative w-full"> */}
        {!noLabel && <Label id={id} name={label} lwidth={lwidth} isDisplay={isDisplay} />}
        <div ref={ref}
          className={`custom-select ${isOpen ? 'active' : ''} w-full`}
          // onClick={toggleOptions}
          style={{
            // width: defaultStyle.width,
            height: "30px",
            position: 'relative',
            cursor: 'pointer',
            visibility: isDisplay ? 'visible' : 'hidden'  
          }}
        >
          <MaskedInputField id={id} ref={focusRef} value={displayText} options={{ myPlaceholder: initText, textAlign: 'center', noLabel: true, isNotManageSetValue: true, isAutoComplete: "off" }} height='h-8'
            events={{
              onChange(e) {
                e.preventDefault();
                // log("onChange", e.target.value)
                if (!isOpen) setIsOpen(true);
                handleCustChange(e.target.value);
              },
              onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
                switch (e.key) {
                  case "ArrowUp":
                  case "ArrowDown":
                    // ref2?.current?.focus();
                    e.preventDefault();
                    if (!isOpen) setIsOpen(true);
                    var rowIndex = -1;
                    if (gridRef.current.api?.getSelectedNodes()[0] && gridRef.current.api?.getSelectedNodes()[0].id) rowIndex = gridRef.current.api?.getSelectedNodes()[0].id;
                    // // gridRef.current.api.ensureIndexVisible(rowIndex, 'top');
                    var move = e.key === 'ArrowUp' ? -1 : 1;
                    // log("Arrow", gridRef.current.api?.getSelectedNodes(), rowIndex, isOpen && gridRef.current.api.getRowNode(Number(rowIndex)+move));
                    if (isOpen && gridRef.current.api.getRowNode(Number(rowIndex)+move)) {
                      gridRef.current.api.setFocusedCell(Number(rowIndex)+move, /*valueCol![0]*/displayCol);
                      gridRef.current.api.getRowNode(Number(rowIndex)+move).setSelected(true);
                    }

                    break;
                  case "Enter":
                    // log("??enter")
                    moveNextComponent();
                    if (isOpen) setIsOpen(false);
                    break;
                }
              },
              onFocus(e) {
                // log("=====onFocus")
                e.target.select();
              },
            }}
            />      
          
          <div className="select-arrow"
            style={{
              position: 'absolute',
              top: '50%',
              right: '5px',
              transform: 'translateY(-50%)',
              cursor: 'pointer',
              visibility: isDisplay ? 'visible' : 'hidden' , 
              pointerEvents: isReadOnly ? 'none' : 'auto'
            }}
            onClick={() => {
              const inputElement = document.querySelector(`#${id}`);
              if (inputElement instanceof HTMLElement) inputElement.focus();
              toggleOptions();
            }}
          >
            {isOpen ? <FaChevronUp className="arrow-icon" /> : <FaChevronDown className="arrow-icon" />}
          </div>
        {isDisplayX ? <div className='close'
          style={{
            position: 'absolute',
            top: '50%',
            right: '25px',
            transform: 'translateY(-50%)',
            cursor: 'pointer',
          }}
          onClick={handleXClick}
        ><IoMdClose /></div>
          : <></>
        }
        </div>
        
        <div ref={ref2}
          className={`py-0.2 absolute left-0 flex bg-opacity-30 top-5 ${isOpen ? '' : 'hidden'}`}
          style={{
              ...defaultGridStyle,
              top: openDirection === 'down' ? 'calc(100% + 5px)' : 'auto',
              bottom: openDirection === 'up' ? 'calc(100% + 1px)' : 'auto',
            }}
        >
          { isDisplay && 
          <Grid
            id="customSelect"
            customselect={customselect}
            gridRef={gridRef}
            listItem={filteredData}
            options={{ ...gridOption, gridHeight: defaultGridStyle.height, isSelectRowAfterRender: isSelectRowAfterRender, isNoSaveColInfo:true }}
            event={{
              // onCellValueChanged: handleCellValueChanged,
              onSelectionChanged: handleSelectionChanged,
              onRowClicked: handelRowClicked,
              onGridReady: handleOnGridReady,
              onCellKeyDown: handleCellKeyDown,
              onComponentStateChanged: handleComponentStateChanged
            }}
          />
          }
        </div>
        
        {/* </div> */}
      </InputWrapper>
    </>
  );
});

export default memo(CustomSelect
      // , (prevProps:Props, nextProps:Props)=> {
      //     // log("memo(CustomSelect)", prevProps, nextProps, prevProps.defaultValue === nextProps.defaultValue);
      //     return prevProps.defaultValue + '' === nextProps.defaultValue + '';}
      );
// export default CustomSelect;
