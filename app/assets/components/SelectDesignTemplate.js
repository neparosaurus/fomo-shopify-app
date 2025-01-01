import React, { useEffect, useState } from 'react';
import { darkenColor, lightenColor } from '../utils/colorUtils';

function SelectDesignTemplate({ initialSelectedId, fontFamily, textColor, backgroundColor, onOptionSelect }) {
    const [selectedContent, setSelectedContent] = useState('');
    const [isDropdownOpen, setDropdownOpen] = useState(false);

    const options = [
        {
            id: '1',
            content: (
                <div className="toast-content toast-show-thumb style-1">
                    <div className="toast-message">
                        <span>Mirko Vasiljevic</span> from <span>Leeds</span> bought 1 month ago
                        <a href="/products/montagne-jeunesse-softening-glove-treatment-masque" target="_blank">7th Heaven Coconut &amp; Clay Peel-Off Face Mask</a>
                    </div>
                    <div className="toast-image">
                        <img
                            src="https://cdn.shopify.com/s/files/1/0056/3295/0385/products/470676011_0_640x640_3d3c2172-1681-43d8-8abf-f0783cf63821.jpg?v=1633785725&amp;height=84"
                            alt="7th Heaven Coconut &amp; Clay Peel-Off Face Mask"
                        />
                    </div>
                    <div className="toast-close"></div>
                </div>
            ),
        },
        {
            id: '2',
            content: (
				<div className="toast-content toast-show-thumb toast-row-reverse style-1">
					<div className="toast-message">
						<span>Mirko Vasiljevic</span> from <span>Leeds</span> bought 1 month ago 
						<a href="/products/montagne-jeunesse-softening-glove-treatment-masque" target="_blank">7th Heaven Coconut &amp; Clay Peel-Off Face Mask</a>
					</div>
					<div className="toast-image">
						<img
                            src="https://cdn.shopify.com/s/files/1/0056/3295/0385/products/470676011_0_640x640_3d3c2172-1681-43d8-8abf-f0783cf63821.jpg?v=1633785725&amp;height=84"
                            alt="7th Heaven Coconut &amp; Clay Peel-Off Face Mask"
                        />
					</div>
					<div className="toast-close"></div>
				</div>
            ),
        },
        {
            id: '3',
            content: (
				<div className="toast-content toast-show-thumb toast-align-top toast-flat style-1">
					<div className="toast-message">
						<span>Mirko Vasiljevic</span> from <span>Leeds</span> bought 1 month ago 
						<a href="/products/montagne-jeunesse-softening-glove-treatment-masque" target="_blank">7th Heaven Coconut &amp; Clay Peel-Off Face Mask</a>
					</div>
					<div className="toast-image">
						<img
                            src="https://cdn.shopify.com/s/files/1/0056/3295/0385/products/470676011_0_640x640_3d3c2172-1681-43d8-8abf-f0783cf63821.jpg?v=1633785725&amp;height=84"
                            alt="7th Heaven Coconut &amp; Clay Peel-Off Face Mask"
                        />
					</div>
					<div className="toast-close"></div>
				</div>
            ),
        },
        {
            id: '4',
            content: (
				<div className="toast-content toast-show-thumb style-1">
					<div className="toast-message">
						<span>Mirko</span> from <span>Leeds</span> bought 1 month ago 
						<a href="/products/montagne-jeunesse-softening-glove-treatment-masque" target="_blank">Face Mask</a>
					</div>
					<div className="toast-image">
						<img
                            src="https://cdn.shopify.com/s/files/1/0056/3295/0385/products/470676011_0_640x640_3d3c2172-1681-43d8-8abf-f0783cf63821.jpg?v=1633785725&amp;height=84"
                            alt="7th Heaven Coconut &amp; Clay Peel-Off Face Mask"
                        />
					</div>
					<div className="toast-close"></div>
				</div>
            ),
        },
        {
            id: '5',
            content: (
				<div className="toast-content style-1">
					<div className="toast-message">
						<span>Mirko</span> from <span>Leeds</span> bought 1 month ago 
						<a href="/products/montagne-jeunesse-softening-glove-treatment-masque" target="_blank">Face Mask</a>
					</div>
					<div className="toast-close"></div>
				</div>
            ),
        },
        {
            id: '6',
            content: (
				<div className="toast-content toast-show-thumb toast-align-top toast-flat style-2">
					<div className="toast-image">
						<img
                            src="https://cdn.shopify.com/s/files/1/0056/3295/0385/products/470676011_0_640x640_3d3c2172-1681-43d8-8abf-f0783cf63821.jpg?v=1633785725&amp;height=84"
                            alt="7th Heaven Coconut &amp; Clay Peel-Off Face Mask"
                        />
					</div>
					<div className="toast-message">
						<span>Mirko</span> from <span>Leeds</span> bought 1 month ago 
						<a href="/products/montagne-jeunesse-softening-glove-treatment-masque" target="_blank">Face Mask</a>
					</div>
					<div className="toast-close"></div>
				</div>
			),
        },
        {
            id: '7',
            content: (
				<div className="toast-content toast-show-thumb toast-flat style-2">
					<div className="toast-close"></div>
					<div className="toast-message">
						<span>Mirko</span> from <span>Leeds</span> bought 1 month ago 
						<a href="/products/montagne-jeunesse-softening-glove-treatment-masque" target="_blank">Face Mask</a>
					</div>
					<div className="toast-image">
						<img
                            src="https://cdn.shopify.com/s/files/1/0056/3295/0385/products/470676011_0_640x640_3d3c2172-1681-43d8-8abf-f0783cf63821.jpg?v=1633785725&amp;height=84"
                            alt="7th Heaven Coconut &amp; Clay Peel-Off Face Mask"
                        />
					</div>
				</div>
            ),
        },
        {
            id: '8',
            content: (
				<div className="toast-content toast-show-thumb style-2 no-shadow">
					<div className="toast-image">
						<img
                            src="https://cdn.shopify.com/s/files/1/0056/3295/0385/products/470676011_0_640x640_3d3c2172-1681-43d8-8abf-f0783cf63821.jpg?v=1633785725&amp;height=84"
                            alt="7th Heaven Coconut &amp; Clay Peel-Off Face Mask"
                        />
					</div>
					<div className="toast-message">
						<span>Mirko Vasiljevic</span> from <span>Leeds</span> bought 1 month ago 
						<a href="/products/montagne-jeunesse-softening-glove-treatment-masque" target="_blank">7th Heaven Coconut &amp; Clay Peel-Off Face Mask</a>
					</div>
					<div className="toast-close"></div>
				</div>
            ),
        },
        {
            id: '9',
            content: (
				<div className="toast-content style-2">
					<div className="toast-message">
						<span>Mirko Vasiljevic</span> from <span>Leeds</span> bought 1 month ago 
						<a href="/products/montagne-jeunesse-softening-glove-treatment-masque" target="_blank">7th Heaven Coconut &amp; Clay Peel-Off Face Mask</a>
					</div>
					<div className="toast-close"></div>
				</div>
            ),
        },
        {
            id: '10',
            content: (
                <div className="toast-content style-2 no-shadow">
                    <div className="toast-message">
                        <span>Mirko</span> from <span>Leeds</span> bought 1 month ago
                        <a href="/products/montagne-jeunesse-softening-glove-treatment-masque" target="_blank">Face Mask</a>
                    </div>
                    <div className="toast-close"></div>
                </div>
            ),
        },
        {
            id: '11',
            content: (
				<div className="toast-content toast-show-thumb style-2 no-shadow">
					<div className="toast-image">
						<img
                            src="https://cdn.shopify.com/s/files/1/0056/3295/0385/products/470676011_0_640x640_3d3c2172-1681-43d8-8abf-f0783cf63821.jpg?v=1633785725&amp;height=84"
                            alt="7th Heaven Coconut &amp; Clay Peel-Off Face Mask"
                        />
					</div>
					<div className="toast-message">
						<span>Mirko</span> from <span>Leeds</span> bought 1 month ago 
						<a href="/products/montagne-jeunesse-softening-glove-treatment-masque" target="_blank">Face Mask</a>
					</div>
					<div className="toast-close"></div>
				</div>
			),
        },
        {
            id: '12',
            content: (
				<div className="toast-content toast-show-thumb toast-flat style-3">
					<div className="toast-image">
						<img
                            src="https://cdn.shopify.com/s/files/1/0056/3295/0385/products/470676011_0_640x640_3d3c2172-1681-43d8-8abf-f0783cf63821.jpg?v=1633785725&amp;height=84"
                            alt="7th Heaven Coconut &amp; Clay Peel-Off Face Mask"
                        />
					</div>
					<div className="toast-message">
						<span>Mirko</span> from <span>Leeds</span><br /> bought
						<a href="/products/montagne-jeunesse-softening-glove-treatment-masque" target="_blank">Face Mask</a>
					</div>
					<div className="toast-close"></div>
				</div>
            ),
        },
        {
            id: '13',
            content: (
				<div className="toast-content toast-show-thumb style-3">
					<div className="toast-image">
						<img
                            src="https://cdn.shopify.com/s/files/1/0056/3295/0385/products/470676011_0_640x640_3d3c2172-1681-43d8-8abf-f0783cf63821.jpg?v=1633785725&amp;height=84"
                            alt="7th Heaven Coconut &amp; Clay Peel-Off Face Mask"
                        />
					</div>
					<div className="toast-message">
						<span>Mirko</span> from <span>Leeds</span> bought 
						<a href="/products/montagne-jeunesse-softening-glove-treatment-masque" target="_blank">Face Mask</a>
					</div>
					<div className="toast-close"></div>
				</div>
			),
        },
        {
            id: '14',
            content: (
				<div className="toast-content toast-row-reverse toast-align-top toast-show-thumb style-3">
					<div className="toast-image">
						<img
                            src="https://cdn.shopify.com/s/files/1/0056/3295/0385/products/470676011_0_640x640_3d3c2172-1681-43d8-8abf-f0783cf63821.jpg?v=1633785725&amp;height=84"
                            alt="7th Heaven Coconut &amp; Clay Peel-Off Face Mask"
                        />
					</div>
					<div className="toast-message">
						<span>Mirko</span> from <span>Leeds</span> bought 
						<a href="/products/montagne-jeunesse-softening-glove-treatment-masque" target="_blank">Face Mask</a>
					</div>
					<div className="toast-close"></div>
				</div>
			),
        },
        {
            id: '15',
            content: (
				<div className="toast-content style-3">
					<div className="toast-message">
						<span>Mirko</span> from <span>Leeds</span> bought 
						<a href="/products/montagne-jeunesse-softening-glove-treatment-masque" target="_blank">Face Mask</a>
					</div>
					<div className="toast-close"></div>
				</div>
            ),
        },
        {
            id: '16',
            content: (
				<div className="toast-content toast-show-thumb toast-flat style-4">
					<div className="toast-image">
						<img
                            src="https://cdn.shopify.com/s/files/1/0056/3295/0385/products/470676011_0_640x640_3d3c2172-1681-43d8-8abf-f0783cf63821.jpg?v=1633785725&amp;height=84"
                            alt="7th Heaven Coconut &amp; Clay Peel-Off Face Mask"
                        />
					</div>
					<div className="toast-message">
						<span>Mirko</span> from <span>Leeds</span> bought 
						<a href="/products/montagne-jeunesse-softening-glove-treatment-masque" target="_blank">Face Mask</a>
					</div>
					<div className="toast-close"></div>
				</div>
			),
        },
        {
            id: '17',
            content: (
				<div className="toast-content style-4">
					<div className="toast-message">
						<span>Mirko</span> from <span>Leeds</span> bought 
						<a href="/products/montagne-jeunesse-softening-glove-treatment-masque" target="_blank">Face Mask</a>
					</div>
					<div className="toast-close"></div>
				</div>
            ),
        },
        {
            id: '18',
            content: (
				<div className="toast-content toast-row-reverse style-4">
					<div className="toast-message">
						<span>Mirko</span> from <span>Leeds</span> bought 
						<a href="/products/montagne-jeunesse-softening-glove-treatment-masque" target="_blank">Face Mask</a>
					</div>
					<div className="toast-close"></div>
				</div>
            ),
        }
    ]

    useEffect(() => {
        const initialOption = options.find(option => option.id === initialSelectedId);
        if (initialOption) {
            setSelectedContent(initialOption.content);
        }
    }, [initialSelectedId]);

    const handleOptionClick = (id, content) => {
        setSelectedContent(content);
        setDropdownOpen(false);
        onOptionSelect(id);
    };

    const toggleDropdown = () => {
        setDropdownOpen(prevState => !prevState);
    };

    return (
        <div
            className="select"
            style={{
                '--bg-color-1': backgroundColor,
                '--text-color-1': textColor,
                '--close-color-1': textColor,

                '--bg-color-2': backgroundColor,
                '--bg-color-2-darker': darkenColor(backgroundColor, .2),
                '--bg-color-2-brighter': lightenColor(backgroundColor, .2),
                '--text-color-2': textColor,
                '--text-color-2-darker': darkenColor(textColor, 0.2),
                '--close-color-2': '#fff',

                '--bg-color-3': backgroundColor,
                '--bg-color-3-border': darkenColor(backgroundColor, 0.1),
                '--text-color-3': textColor,
                '--text-color-3-darker': darkenColor(textColor, 0.3),
                '--close-color-3': '#ccc',

                '--bg-color-4': backgroundColor,
                '--text-color-4': textColor,
                '--text-color-4-darker': darkenColor(textColor, .6),
                '--text-color-4-bg': lightenColor(backgroundColor, .3),
                '--close-color-4': textColor,
            }}
        >
            <div className="selected" onClick={toggleDropdown}>
                {selectedContent || 'Select an option'}
            </div>
            {isDropdownOpen && (
                <div className="dropdown">
                    {options.map((option) => (
                        <div
                            key={option.id}
                            className="option"
                            onClick={() => handleOptionClick(option.id)}
                        >
                            {option.content}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default SelectDesignTemplate;