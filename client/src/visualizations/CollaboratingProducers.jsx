/* eslint-disable no-undef */
import axios from "axios";
import { useState, useEffect } from "react";
import cytoscape from 'cytoscape';
import popper from 'cytoscape-popper';
import tippy from 'tippy.js';

cytoscape.use(popper);

function CollaboratingProducers() {

    useEffect(() => {
        let nodes = [
            { data: { id: '1', degree: 7, radius: 7 * 5, label: 'Node 1', text: "Total collabs: 7" } },
            { data: { id: '2', degree: 2, radius: 2 * 5, label: 'Node 2', text: "Total collabs: 2" } },
            { data: { id: '3', degree: 5, radius: 5 * 5, label: 'Node 3', text: "Total collabs: 5" } }
        ];
        let edges = [
            { data: { id: '1_2', source: '1', target: '2', weight: 2, text: 'had 2 collabs. with' } },
            { data: { id: '1_3', source: '1', target: '3', weight: 5, text: 'had 5 collabs. with' } }
        ];
        let stylesheet = [
            {
                selector: 'node',
                style: {
                    label: "data(label)",
                    'background-color': 'black',
                    width: "data(radius)",
                    height: "data(radius)",
                }
            },
            {
                selector: 'edge',
                style: {
                    width: "data(weight)"
                }
            }
        ];

        const cy = cytoscape({
            container: document.getElementById("networkGraph"),
            style: stylesheet,
            elements: {
                nodes: nodes,
                edges: edges
            },
            layout: { name: 'random' },
            wheelSensitivity: 0.05
        });

        cy.ready(() => {
            cy.elements().forEach(ele => {
                makePopper(ele);
            });
        });

        cy.elements().unbind('mouseover');
        cy.elements().bind('mouseover', (event) => event.target.tippy.show());

        cy.elements().unbind('mouseout');
        cy.elements().bind('mouseout', (event) => event.target.tippy.hide());

        cy.elements().unbind('drag');
        cy.elements().bind('drag', (event) => event.target.tippy.hide());
    }, []);

    const makePopper = ele => {
        let ref = ele.popperRef();
        ele.tippy = tippy(document.createElement('div'), {
            getReferenceClientRect: ref.getBoundingClientRect,
            trigger: 'manual',
            content: function () {
                let div = document.createElement('div');
                div.innerHTML = ele.data().text;
                return div;
            },
            arrow: true,
            placement: 'bottom',
            hideOnClick: false,
            sticky: "reference",
            interactive: true,
            appendTo: document.body // or append dummyDomEle to document.body
        });
    };

    return (
        <div style={{ textAlign: 'left' }}>
            <div style={{ textAlign: 'center' }}>
                <h3 style={{ marginBottom: 0 }}>Frequencies of Collaborations between Anime Producers</h3>
                <i style={{ fontSize: '12px' }}>(Raw data can be seen with API extension: /collab-prods)</i>
            </div>
            <div id="networkGraph" style={{ height: '500px', width: window.innerWidth, backgroundColor: 'lightgrey' }}></div>
        </div>
    );

}

export default CollaboratingProducers;