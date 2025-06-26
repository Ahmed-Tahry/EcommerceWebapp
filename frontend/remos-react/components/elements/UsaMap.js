'use client'
import React, { useRef } from "react"
import { VectorMap } from "react-jvectormap"

const UsaMap = React.memo(() => {
    const mapRef = useRef()

    return (
        <>
            <VectorMap
                ref={mapRef}
                zoomOnScroll={false}
                zoomButtons={false}
                map={"us_aea"}
                backgroundColor="#F2F7FB" //change it to ocean blue: #0077be
                // zoomOnScroll={false}
                containerStyle={{
                    width: "100%",
                    height: "100%",
                }}
                // onRegionClick={handleClick} //gets the country code
                // onRegionTipShow={tooltipData}
                containerClassName="map"
                regionStyle={{
                    initial: {
                        fill: "#D8E6F1",
                        "fill-opacity": 0.9,
                        stroke: "none",
                        "stroke-width": 0,
                        "stroke-opacity": 0,
                    },
                    hover: {
                        "fill-opacity": 0.8,
                        cursor: "pointer",
                    },
                    selected: {
                        fill: "#2938bc", //color for the clicked country
                    },
                    selectedHover: {},
                }}
                regionsSelectable={true}
                // series={{
                //     regions: [
                //         {
                //             values: mapData, //this is your data
                //             scale: ["#2082FB", "#673BB7"], //your color game's here
                //             normalizeFunction: "polynomial",
                //         },
                //     ],
                // }}
            />
        </>
    )
})

export default UsaMap

