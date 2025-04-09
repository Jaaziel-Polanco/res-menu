
const Loading = () => {

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
            <div className="relative flex flex-col items-center">
                <div className="spinner">
                    <span className="icon-[codex--loader] w-28 h-28" role="img" aria-hidden="true" />
                </div>
            </div>
        </div>
    );
};

export default Loading;
