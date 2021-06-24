import React, { useLayoutEffect, useRef } from 'react';
import './index.scss';

import HorizontalScroll from './horizontal-scroll';

export default function ReactHorizontalScroll(props) {
    const container = useRef(null);
    let hs;
    useLayoutEffect(() => {
        // Find the corresponding
        // var container = document.getElementsByClassName('container');
        var blocks;
        
        if(container){
            blocks = document.getElementsByClassName('block');
            if(blocks){
                console.log('initialised');
                
                hs = new HorizontalScroll({
                    blocks : blocks,
                    container: container,
                    skewReduce: 400
                }); 
                hs.onResize();
            }
        }

        return(() =>{
            hs.destroy();
            console.log('destroyed');
        })
    },[hs])

    return (
        <>
            <div class="hs-overlay"></div>
            <div className="container" ref={container}> 
                <div className="horizontal-scroll HScroll">
                    {props.children}
                </div>
            </div>
        </>
    )
}
