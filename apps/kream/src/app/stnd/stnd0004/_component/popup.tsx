import DialogBasic from "@/page-parts/tmpl/dialog/dialog"
import { useForm, FormProvider, SubmitHandler, useFieldArray } from "react-hook-form";
import { useStnd0004Store } from "@/states/stnd/stnd0004.store"
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useZod } from "utils/zod"
import { TButtonBlue, TButtonGray } from "@/page-parts/tmpl/form/button";

type Props = {
    isOpen: boolean;
    popType: string;
    setIsOpen: (val: boolean, popType?: string) => void;
    setData?: (data: any) => void;
}
const Modal: React.FC<Props> = ({ isOpen, popType, setIsOpen, setData }) => {

    const { t, zodStringRequired } = useZod()

    const closeModal = () => {
        setIsOpen(false, popType);
        // reset();
    }

    return (
        <></>
        // <FormProvider>
        //     <form>
        //         <DialogBasic
        //         isOpen={isOpen}
        //         onClose={closeModal}
        //         title={"등록"}
        //         bottomRight={
        //             <>
        //             <TButtonBlue label={"저장"}/>
        //             <TButtonGray label={"취소"} onClick={closeModal}/>
        //             </>
        //         }
        //         >

        //         </DialogBasic>
        //     </form>
        // </FormProvider>

    )

}

export default Modal