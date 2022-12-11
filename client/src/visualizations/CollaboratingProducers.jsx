/* eslint-disable no-undef */
import { useEffect, useState } from "react";

const stylesheet = [{ selector: 'node', style: { label: "data(label)", 'background-color': 'black', 'font-size': "data(fontSize)", 'text-halign': 'center', 'text-valign': 'center', 'text-outline-color': 'white', 'text-outline-width': "data(outlineWidth)", width: "data(radius)", height: "data(radius)" } }, { selector: 'edge', style: { width: "data(width)" } }, { selector: 'core', style: { 'active-bg-size': 0 } }];

function CollaboratingProducers() {
    const [n, setN] = useState(10);
    const [value, setValue] = useState(n);
    const [maxRange, setMaxRange] = useState(0);
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

                const makePopperWithTippy = ele => {
                    let ref = ele.popperRef();
                    ele.tippy = tippy(document.createElement('div'), {
                        lazy: false,
                        followCursor: 'true',
                        hideOnClick: false,
                        flipOnUpdate: true,
                        onShow(instance) {
                            instance.popperInstance.reference = ref
                        },
                    });
                    ele.tippy.setContent(ele.data().text);
                };

                cy.ready(() => {
                    cy.elements().forEach(ele => {
                        makePopperWithTippy(ele);
                    });
                });

                cy.elements().unbind('mouseover');
                cy.elements().bind('mouseover', event => event.target.tippy.show());

                cy.elements().unbind('mouseout');
                cy.elements().bind('mouseout', event => event.target.tippy.hide());

                cy.elements().unbind('drag');
                cy.elements().bind('drag', event => event.target.tippy.popperInstance.update());

                const resetView = () => {
                    cy.fit();
                };
                setResetView(() => resetView);
            }
        });
    }, [n]);

    return (
        <div style={{ backgroundColor: '#6f6f6f', color: 'white', textAlign: 'left' }}>
            <div style={{ textAlign: 'center' }}>
                <h2 style={{ marginBottom: 0 }}>Frequencies of Collaborations between Anime Producers</h2>
                <i style={{ fontSize: '14px' }}>(Raw data can be seen with API extension: /collab-prods/:n)<br />[:n is '{maxRange}' by default]</i>
                <div style={{ width: 'fit-content', margin: 'auto', padding: 15 }}>
                    <label style={{ color: '#EFEFEF' }}>Top {n} Producers with the Most Collaborations (2-{maxRange}):</label>
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
            <div id="networkGraph" className="dataplot" style={{ height: '500px', backgroundColor: 'lightgray' }}></div>
        </div>
    );

}

export default CollaboratingProducers;