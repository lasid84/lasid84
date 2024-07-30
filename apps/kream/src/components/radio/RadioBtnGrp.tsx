// // import { Wrapper } from "./styles";
// import { RadioProps } from "components/radio/index";
// import RadioBtn from "./index";
// import { RadioBtnGroupProps, RadioBtnOption } from "components/radio";

// const RadioBtnGroup = ({ options, onChange, value }: RadioBtnGroupProps) => {
//   function renderOptions() {
//     return options.map(
//       ({ label, name, value: optionValue }: RadioBtnOption) => {

//         const optionId = `radio-option-${label}`;
//         var isChecked = value === optionValue;
//         console.log('updated?', label, name, value, isChecked)

//         return (
//           <RadioBtn
//             value={optionValue}
//             label={label}
//             key={optionId}
//             id={optionId}
//             name={name}
//             onChange={onChange}
//             checked={isChecked}
//           />
//         );
//       }
//     );
//   }
//   return <>{renderOptions()}</>;
// };

// export default RadioBtnGroup;
