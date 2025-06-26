import ChatList from "../chart/ChartList"


export default function ChartDefault2() {
    return (
        <>

                <div className="wg-chart-default style-1">
                    <div className="flex flex-column gap15 flex-shrink-0">
                        <div className="flex gap14 flex-column">
                            <div className="image type-white">
                                <svg xmlns="http://www.w3.org/2000/svg" width={48} height={52} viewBox="0 0 48 52" fill="none">
                                    <path d="M19.1094 2.12943C22.2034 0.343099 26.0154 0.343099 29.1094 2.12943L42.4921 9.85592C45.5861 11.6423 47.4921 14.9435 47.4921 18.5162V33.9692C47.4921 37.5418 45.5861 40.8431 42.4921 42.6294L29.1094 50.3559C26.0154 52.1423 22.2034 52.1423 19.1094 50.3559L5.72669 42.6294C2.63268 40.8431 0.726688 37.5418 0.726688 33.9692V18.5162C0.726688 14.9435 2.63268 11.6423 5.72669 9.85592L19.1094 2.12943Z" fill="#22C55E" />
                                </svg>
                                <i className="icon-shopping-bag" />
                            </div>
                            <div>
                                <div className="body-text mb-2">Total Sales</div>
                                <h3>34,945</h3>
                            </div>
                        </div>
                        <div className="box-icon-trending up">
                            <div className="body-title number tf-color-2">1.56%</div>
                            <i className="icon-trending-up" />
                        </div>
                    </div>
                    <div className="wrap-chart flex-grow">
                        <ChatList style={2} />
                    </div>
                </div>
                {/* /chart-default */}
                {/* chart-default */}
                <div className="wg-chart-default style-1">
                    <div className="flex flex-column gap15 flex-shrink-0">
                        <div className="flex gap14 flex-column">
                            <div className="image type-white">
                                <svg xmlns="http://www.w3.org/2000/svg" width={48} height={52} viewBox="0 0 48 52" fill="none">
                                    <path d="M19.1094 2.12943C22.2034 0.343099 26.0154 0.343099 29.1094 2.12943L42.4921 9.85592C45.5861 11.6423 47.4921 14.9435 47.4921 18.5162V33.9692C47.4921 37.5418 45.5861 40.8431 42.4921 42.6294L29.1094 50.3559C26.0154 52.1423 22.2034 52.1423 19.1094 50.3559L5.72669 42.6294C2.63268 40.8431 0.726688 37.5418 0.726688 33.9692V18.5162C0.726688 14.9435 2.63268 11.6423 5.72669 9.85592L19.1094 2.12943Z" fill="#FF5200" />
                                </svg>
                                <i className="icon-dollar-sign" />
                            </div>
                            <div>
                                <div className="body-text mb-2">Total Income</div>
                                <h3>$37,802</h3>
                            </div>
                        </div>
                        <div className="box-icon-trending down">
                            <div className="body-title number tf-color-1">1.56%</div>
                            <i className="icon-trending-down" />
                        </div>
                    </div>
                    <div className="wrap-chart flex-grow">
                        <ChatList style={2} />
                    </div>
                </div>
                {/* /chart-default */}
                {/* chart-default */}
                <div className="wg-chart-default style-1">
                    <div className="flex flex-column gap15 flex-shrink-0">
                        <div className="flex gap14 flex-column">
                            <div className="image type-white">
                                <svg xmlns="http://www.w3.org/2000/svg" width={48} height={52} viewBox="0 0 48 52" fill="none">
                                    <path d="M19.1094 2.12943C22.2034 0.343099 26.0154 0.343099 29.1094 2.12943L42.4921 9.85592C45.5861 11.6423 47.4921 14.9435 47.4921 18.5162V33.9692C47.4921 37.5418 45.5861 40.8431 42.4921 42.6294L29.1094 50.3559C26.0154 52.1423 22.2034 52.1423 19.1094 50.3559L5.72669 42.6294C2.63268 40.8431 0.726688 37.5418 0.726688 33.9692V18.5162C0.726688 14.9435 2.63268 11.6423 5.72669 9.85592L19.1094 2.12943Z" fill="#2377FC" />
                                </svg>
                                <i className="icon-users" />
                            </div>
                            <div>
                                <div className="body-text mb-2">Total Visitor</div>
                                <h3>34,945</h3>
                            </div>
                        </div>
                        <div className="box-icon-trending up">
                            <div className="body-title number tf-color-2">1.56%</div>
                            <i className="icon-trending-up" />
                        </div>
                    </div>
                    <div className="wrap-chart flex-grow">
                        <ChatList style={2} />
                    </div>
                </div>
        </>
    )
}
