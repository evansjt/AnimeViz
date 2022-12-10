/* eslint-disable no-undef */
import axios from "axios";
import { useEffect, useState } from "react";
import cytoscape from 'cytoscape';
import popper from 'cytoscape-popper';
import tippy from 'tippy.js';

cytoscape.use(popper);

const stylesheet = [{ selector: 'node', style: { label: "data(label)", 'background-color': 'black', 'font-size': "data(fontSize)", 'text-halign': 'center', 'text-valign': 'center', 'text-outline-color': 'white', 'text-outline-width': "data(outlineWidth)", width: "data(radius)", height: "data(radius)" } }, { selector: 'edge', style: { width: "data(width)" } }, { selector: 'core', style: { 'active-bg-size': 0 } }];

function CollaboratingProducers() {
    const [n, setN] = useState(10);
    const [value, setValue] = useState(n);
    const [maxRange, setMaxRange] = useState(n);
    const [resetView, setResetView] = useState(() => { });

    useEffect(() => {
        axios.get(`/collab-prods/${n}`, { crossdomain: true }).then(res => {
            const elements = res.data.elements;
            setMaxRange(res.data.maxRange);

            drawNetworkGraph(elements);

            function drawNetworkGraph(elements) {
                const cy = cytoscape({
                    container: document.getElementById("networkGraph"),
                    style: stylesheet,
                    elements: elements,
                    layout: { name: 'concentric' },
                    wheelSensitivity: 0.05
                });

                const makePopper = ele => {
                    let ref = ele.popperRef();
                    ele.tippy = tippy(document.createElement('div'), {
                        getReferenceClientRect: ref.getBoundingClientRect,
                        trigger: 'manual',
                        content: () => {
                            let div = document.createElement('div');
                            div.innerHTML = ele.data().text;
                            return div;
                        },
                        arrow: true,
                        placement: 'bottom',
                        hideOnClick: true,
                        sticky: "reference",
                        interactive: true,
                        appendTo: document.body // or append dummyDomEle to document.body
                    });
                };

                cy.ready(() => {
                    cy.elements().forEach(ele => {
                        makePopper(ele);
                    });
                });

                cy.elements().unbind('mouseover');
                cy.elements().bind('mouseover', (event) => event.target.tippy.show());

                cy.elements().unbind('mouseout');
                cy.elements().bind('mouseout', (event) => event.target.tippy.hide());

                const resetView = () => {
                    cy.fit();
                };
                setResetView(() => resetView);
            }
        });
    }, [n]);

    return (
        <div style={{ textAlign: 'left' }}>
            <div style={{ textAlign: 'center' }}>
                <h3 style={{ marginBottom: 0 }}>Frequencies of Collaborations between Anime Producers</h3>
                <i style={{ fontSize: '12px' }}>(Raw data can be seen with API extension: /collab-prods/:n)</i>
                <div style={{ backgroundColor: 'black', color: 'white', width: 'fit-content', margin: 'auto', padding: 15 }}>
                    <label>Top {n} Producers with the Most Collaborations (2-{maxRange}):</label>
                    <input type="number" min={2} max={maxRange} value={value} onChange={e => {
                        const val = e.target.value;
                        if (val > 1 && val <= maxRange) setValue(val);
                    }} />
                    <div>
                        <button onClick={e => setN(value)}>Generate!</button>
                        <button onClick={resetView}>Reset View</button>
                    </div>
                </div>
            </div>
            <div id="networkGraph" className="dataplot" style={{ height: '500px', backgroundColor: 'lightgrey' }}></div>
        </div>
    );

}

export default CollaboratingProducers;