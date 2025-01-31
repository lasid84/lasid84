import { Fragment, useMemo, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useUserSettings } from "states/useUserSettings";
import { FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";

type DialogBasicProps = {
  isOpen: boolean;
  onClose: any;
  title: string;
  children: React.ReactNode;
  bottomLeft?: React.ReactNode;
  bottomRight?: React.ReactNode;
  subtitle?: React.ReactNode;
  description?: React.ReactNode;
};

const DialogBasic: React.FC<DialogBasicProps> = ({
  isOpen,
  onClose,
  title,
  children,
  bottomLeft = null,
  bottomRight = null,
}) => {
  const onModal = useUserSettings((state) => state.data);
  const isModal = useMemo(() => onModal.loading === "ON", [onModal]);
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-40 overflow-y-auto dialog-base"
          onClose={() => {}}
        >
          <div
            className={`flex flex-col items-center justify-center min-h-screen px-4 text-center ${isModal ? "pointer-events-none" : ""}`}
          >
            {/*Dialog Overlay*/}
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-900/25" />
            </Transition.Child>

            {/*Dialog Contents*/}
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="relative inline-block max-w-full overflow-hidden text-left align-middle bg-white border border-[#999999] dark:bg-gray-900 dark:text-white dark:border-gray-200 shadow-xl transition-all transform rounded-md space-y-4">
                {/*Modal Header*/}
                <div className="border-b dark:border-black px-4 py-4 bg-[#f2f2f2] dark:bg-[#2b3646] dark:text-white">
                  <Dialog.Title as="h3" className="text-[16px] font-bold">
                    {title}
                  </Dialog.Title>
                  <button
                    className="absolute top-0 right-0 m-4 font-bold uppercase"
                    onClick={onClose}
                  >
                    <FiX size={20} className="stroke-current" />
                  </button>
                </div>
                {/*Modal Contents*/}
                {/*Modal Footer*/}
                <div className="px-4 space-y-2 dark:bg-gray-900 dark:text-white dark:border-gray-800">
                  {/* <form> */}
                  {children}
                  {/* </form> */}
                </div>
                {(bottomLeft || bottomRight) && (
                  <div className="flex flex-row justify-between px-4 py-3 border-t border-gray-200 dark:bg-gray-900 dark:text-white dark:border-gray-800">
                    <div className="flex flex-row w-1/2 gap-1">
                      {bottomLeft}
                      <div className="ml-auto"></div>
                    </div>
                    <div className="flex flex-row w-1/2 gap-1">
                      <div className="ml-auto"></div>
                      {bottomRight}
                    </div>
                  </div>
                )}
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

//content Index 관리
export const DialogArrow: React.FC<DialogBasicProps> = ({
  isOpen,
  onClose,
  title,
  children,
  bottomLeft = null,
  bottomRight = null,
  subtitle = null,
  description = null,
}) => {
  const onModal = useUserSettings((state) => state.data);
  const isModal = useMemo(() => onModal.loading === "ON", [onModal]);
  const [contentIndex, setContentIndex] = useState(0);

  const onPrev = () => {
    setContentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    console.log("onPrev clicked");
  };

  const onNext = () => {
    setContentIndex((prevIndex) => prevIndex + 1);
    console.log("onNext clicked");
  };

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-40 overflow-y-auto dialog-base"
          onClose={() => {}}
        >
          <div
            className={`flex flex-col items-center justify-center min-h-screen px-4 text-center ${isModal ? "pointer-events-none" : ""}`}
          >
            {/*Dialog Overlay*/}
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-900/25" />
            </Transition.Child>

            {/* Left Arrow Button */}
            <button
              onClick={onPrev}
              className="absolute left-0 p-6 text-white transform -translate-y-1/2 bg-gray-700 rounded-full top-1/2 hover:bg-gray-600"
            >
              <FiChevronLeft size={32} />
            </button>

            {/* Right Arrow Button */}
            <button
              onClick={onNext}
              className="absolute right-0 p-6 text-white transform -translate-y-1/2 bg-gray-700 rounded-full top-1/2 hover:bg-gray-600"
            >
              <FiChevronRight size={32} />
            </button>

            {/*Dialog Contents*/}
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="relative inline-block max-w-full overflow-hidden text-left align-middle bg-white border border-[#999999] dark:bg-gray-900 dark:text-white dark:border-gray-200 shadow-xl transition-all transform rounded-md space-y-4">
                {/*Modal Header*/}
                <div className="border-b dark:border-black px-4 py-4 bg-[#f2f2f2] dark:bg-[#2b3646] dark:text-white">
                  <Dialog.Title as="h3" className="text-[16px] font-bold">
                    {title}
                  </Dialog.Title>
                  {/* Subtitle */}
                  <div className="flex items-center justify-between mt-1">
                    {subtitle && (
                      <p className="text-[14px] font-medium text-gray-700 dark:text-gray-300">
                        {subtitle}
                      </p>
                    )}
                    {description && (
                      <p className="text-[14px] font-medium text-gray-700 dark:text-gray-400">
                        {description}
                      </p>
                    )}
                  </div>

                  <button
                    className="absolute top-0 right-0 m-4 font-bold uppercase"
                    onClick={onClose}
                  >
                    <FiX size={20} className="stroke-current" />
                  </button>
                </div>
                {/*Modal Contents*/}
                {/*Modal Footer*/}
                <div className="px-4 space-y-0.5 dark:bg-gray-900 dark:text-white dark:border-gray-800">
                  {/* <form> */}
                  {children}
                  {/* </form> */}
                </div>
                {(bottomLeft || bottomRight) && (
                  <div className="flex flex-row justify-between px-4 border-t border-gray-200 dark:bg-gray-900 dark:text-white dark:border-gray-800">
                    <div className="flex flex-row w-1/2 gap-1">
                      {bottomLeft}
                      <div className="ml-auto"></div>
                    </div>
                    <div className="flex flex-row w-1/2 gap-1">
                      <div className="ml-auto"></div>
                      {bottomRight}
                    </div>
                  </div>
                )}
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

const DialogBasic2: React.FC<DialogBasicProps> = ({
  isOpen,
  onClose,
  title,
  children,
  bottomLeft = null,
  bottomRight = null,
}) => {
  const onModal = useUserSettings((state) => state.data);
  const isModal = useMemo(() => onModal.loading === "ON", [onModal]);
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-40 overflow-y-auto dialog-base"
          onClose={() => {}}
        >
          <div
            className={`flex flex-col items-center justify-center min-h-screen px-4 text-center ${isModal ? "pointer-events-none" : ""}`}
          >
            {/*Dialog Overlay*/}
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-900/25" />
            </Transition.Child>

            {/*Dialog Contents*/}
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="relative inline-block max-w-full overflow-hidden text-left align-middle bg-white border border-[#999999] dark:bg-gray-900 dark:text-white dark:border-gray-200 shadow-xl transition-all transform rounded-md space-y-4">
                {/*Modal Header*/}
                <div className="border-b dark:border-black px-4 py-4 bg-[#f2f2f2] dark:bg-[#2b3646] dark:text-white">
                  <Dialog.Title as="h3" className="text-[16px] font-bold">
                    {title}
                  </Dialog.Title>
                  <button
                    className="absolute top-0 right-0 m-4 font-bold uppercase"
                    onClick={onClose}
                  >
                    <FiX size={20} className="stroke-current" />
                  </button>
                </div>
                {/*Modal Contents*/}
                {/*Modal Footer*/}
                <div className="px-4 space-y-2 dark:bg-gray-900 dark:text-white dark:border-gray-800">
                  {/* <form> */}
                  {children}
                  {/* </form> */}
                </div>
                {(bottomLeft || bottomRight) && (
                  <div className="flex flex-row justify-between px-4 py-3 border-t border-gray-200 dark:bg-gray-900 dark:text-white dark:border-gray-800">
                    <div className="flex flex-row w-1/2 gap-1">
                      {bottomLeft}
                      <div className="ml-auto"></div>
                    </div>
                    <div className="flex flex-row w-1/2 gap-1">
                      <div className="ml-auto"></div>
                      {bottomRight}
                    </div>
                  </div>
                )}
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default DialogBasic;
