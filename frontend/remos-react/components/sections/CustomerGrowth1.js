import DotDropdown from "../elements/DotDropdown"
import dynamic from 'next/dynamic'
const UsaMap = dynamic(() => import('../elements/UsaMap'), {
  ssr: false,
})


export default function CustomerGrowth1() {
    return (
        <>

            <div className="wg-box">
                <div className="flex items-center justify-between">
                    <h5>Customer Growth</h5>
                        <DotDropdown />
                </div>
                {/* <div id="usa-vectormap" /> */}
                
                <UsaMap />
                <div className="customer-price-item">
                    <div className="flex items-center gap20 mb-10">
                        <div className="body-text">Washington</div>
                        <div className="body-text">$484 – $786</div>
                    </div>
                    <div className="flex items-center gap10 flex-wrap">
                        <div className="line line-1" style={{ width: 161 }} />
                        <div className="line line-2" style={{ width: 240 }} />
                    </div>
                </div>
                <div className="customer-price-item">
                    <div className="flex items-center gap20 mb-10">
                        <div className="body-text">Oregon</div>
                        <div className="body-text">$290 – $590</div>
                    </div>
                    <div className="flex items-center gap10 flex-wrap">
                        <div className="line line-1" style={{ width: 360 }} />
                        <div className="line line-2" style={{ width: 135 }} />
                    </div>
                </div>
                <div className="customer-price-item">
                    <div className="flex items-center gap20 mb-10">
                        <div className="body-text">Idaho</div>
                        <div className="body-text">$476 – $578</div>
                    </div>
                    <div className="flex items-center gap10 flex-wrap">
                        <div className="line line-1" style={{ width: 251 }} />
                        <div className="line line-2" style={{ width: 194 }} />
                    </div>
                </div>
                <div className="customer-price-item">
                    <div className="flex items-center gap20 mb-10">
                        <div className="body-text">California</div>
                        <div className="body-text">$526 – $735</div>
                    </div>
                    <div className="flex items-center gap10 flex-wrap">
                        <div className="line line-1" style={{ width: 314 }} />
                        <div className="line line-2" style={{ width: 135 }} />
                    </div>
                </div>
                <div className="customer-price-item">
                    <div className="flex items-center gap20 mb-10">
                        <div className="body-text">Nevada</div>
                        <div className="body-text">$137 – $488</div>
                    </div>
                    <div className="flex items-center gap10 flex-wrap">
                        <div className="line line-1" style={{ width: 228 }} />
                        <div className="line line-2" style={{ width: 177 }} />
                    </div>
                </div>
            </div>
        </>
    )
}
