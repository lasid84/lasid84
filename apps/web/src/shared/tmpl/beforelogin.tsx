export type BeforeLoginProps = {
    title: React.ReactNode;
};

const BeforeLogin: React.FC<BeforeLoginProps> = ({
    title,
}) => {
    return (
        <div className="flex">
            <div>
                <div className="flex flex-row items-center justify-between">
                    <div className="flex flex-col">
                        <span className="ag-overlay-loading-center">로그인해주세요</span>
                        <div className="text-xs font-light text-gray-500 uppercase">
                            {title}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BeforeLogin;