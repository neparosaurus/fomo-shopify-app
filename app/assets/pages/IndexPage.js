import '@shopify/polaris/build/esm/styles.css';
import React, {useState, useCallback} from 'react';
import enTranslations from '@shopify/polaris/locales/en.json';
import {
    AppProvider,
    Page,
    Card,
    Button,
    Select,
    ColorPicker,
    Text,
    RangeSlider,
    RadioButton,
    hsbToHex
} from '@shopify/polaris';
import ImportOrders from "../components/ImportOrders";
import SSE from "../components/SSE";

function IndexPage() {
    const marginBtm = '30px';
    const [selected, setSelected] = useState('today');
    const handleFontSelectChange = useCallback(
        (value) => setSelected(value),
        [],
    );
    const fontSelectOptions = [
        {label: 'Arial', value: 'arial'},
        {label: 'Inter', value: 'inter'},
        {label: 'Poppins', value: 'poppins'},
        {label: 'Montserrat', value: 'montserrat'},
    ];
    const [textColor, setTextColor] = useState({
        hue: 360,
        brightness: 1,
        saturation: 0
    });
    const [bgColor, setBgColor] = useState({
        hue: 222,
        brightness: 0.5,
        saturation: 0.9
    });
    const [initDelayRangeValue, setInitDelayRangeValue] = useState(100);
    const handleInitDelayRangeSliderChange = useCallback(
        (value) => setInitDelayRangeValue(value),
        [],
    );
    const [value, setValue] = useState('rounded');

    console.log('textColor', textColor);
    console.log('bgColor', bgColor);

    const handleChange = (_, newValue) => {
        setValue(newValue);
    }

    return (
        <div style={{padding: '0 0 30px 0'}}>
            <AppProvider i18n={enTranslations}>
                <Page title="Notifications App Prototype">
                    <Card>
                        <div style={{marginBottom: marginBtm}}>
                            <div style={{marginBottom: '4px'}}>
                                <Text fontWeight='semibold' variant="headingSm" as="h6">
                                    Select Font
                                </Text>
                            </div>
                            <Select
                                options={fontSelectOptions}
                                onChange={handleFontSelectChange}
                                value={selected}
                                label="Select"/>
                        </div>

                        <div style={{marginBottom: marginBtm}}>
                            <div style={{marginBottom: '4px'}}>
                                <Text fontWeight='semibold' variant="headingSm" as="h6">
                                    Text Colour
                                </Text>
                            </div>
                            <ColorPicker fullWidth onChange={setTextColor} color={textColor}/>
                        </div>

                        <div style={{marginBottom: marginBtm}}>
                            <div style={{marginBottom: '4px'}}>
                                <Text fontWeight='semibold' variant="headingSm" as="h6">
                                    Background Colour
                                </Text>
                            </div>
                            <ColorPicker fullWidth onChange={setBgColor} color={bgColor}/>
                        </div>

                        <div style={{marginBottom: marginBtm}}>
                            <div style={{marginBottom: '4px'}}>
                                <Text fontWeight='semibold' variant="headingSm" as="h6">
                                    Initial Delay
                                </Text>
                            </div>
                            <RangeSlider
                                output
                                label="Initial Delay in Seconds"
                                min={0}
                                max={120}
                                value={initDelayRangeValue}
                                onChange={handleInitDelayRangeSliderChange}
                                suffix={
                                    <p
                                        style={{
                                            minWidth: '24px',
                                            textAlign: 'right',
                                        }}
                                    >
                                        {initDelayRangeValue}
                                    </p>
                                }
                            />
                        </div>

                        <div style={{marginBottom: marginBtm}}>
                            <div style={{marginBottom: '4px'}}>
                                <Text fontWeight='semibold' variant="headingSm" as="h6">
                                    Delay
                                </Text>
                            </div>
                            <RangeSlider
                                output
                                label="Delay in Seconds"
                                min={0}
                                max={120}
                                value={initDelayRangeValue}
                                onChange={handleInitDelayRangeSliderChange}
                                suffix={
                                    <p
                                        style={{
                                            minWidth: '24px',
                                            textAlign: 'right',
                                        }}
                                    >
                                        {initDelayRangeValue}
                                    </p>
                                }
                            />
                        </div>

                        <div style={{marginBottom: marginBtm}}>
                            <div style={{marginBottom: '4px'}}>
                                <Text fontWeight='semibold' variant="headingSm" as="h6">
                                    Corner Style
                                </Text>
                            </div>
                            <div style={{display: 'flex', flexDirection: 'column'}}>
                                <RadioButton
                                    label="Rounded"
                                    checked={value === 'rounded'}
                                    id="rounded"
                                    name="corners"
                                    onChange={handleChange}
                                />
                                <RadioButton
                                    label="Sharp"
                                    id="sharp"
                                    name="corners"
                                    checked={value === 'sharp'}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div style={{
                            backgroundColor: '#1c1c1c',
                            height: '1px',
                            width: '100%',
                            display: 'block',
                            marginBottom: marginBtm,
                            opacity: 0.2
                        }}/>

                        <div>
                            <div style={{
                                backgroundColor: hsbToHex(bgColor),
                                borderRadius: value === 'rounded' ? '5px' : 0,
                                padding: '8px 12px',
                                lineHeight: '1.2em',
                                marginBottom: '5px'
                            }}>
                                <p style={{margin: 0, color: hsbToHex(textColor)}}>
                                    <span style={{fontWeight: '900'}}>Tom Walsh</span> from <span
                                    style={{fontWeight: '900'}}>London</span> just bought a <span
                                    style={{fontWeight: '900'}}>Super Vacuum 3000</span>!
                                </p>
                            </div>
                            <div style={{
                                backgroundColor: hsbToHex(bgColor),
                                borderRadius: value === 'rounded' ? '5px' : 0,
                                padding: '8px 12px',
                                lineHeight: '1.2em',
                                marginBottom: '5px'
                            }}>
                                <p style={{margin: 0, color: hsbToHex(textColor)}}>
                                    <span style={{fontWeight: '900'}}>Robert Jimony</span> from <span
                                    style={{fontWeight: '900'}}>Barcelona</span> just bought a <span
                                    style={{fontWeight: '900'}}><a style={{color: 'inherit'}} href="#">Super Soft Dog Toy</a></span>!
                                </p>
                            </div>
                            <div style={{
                                backgroundColor: hsbToHex(bgColor),
                                borderRadius: value === 'rounded' ? '5px' : 0,
                                padding: '8px 12px',
                                lineHeight: '1.2em',
                                marginBottom: '20px'
                            }}>
                                <p style={{margin: 0, color: hsbToHex(textColor)}}>
                                    <span style={{fontWeight: '900'}}>Joe Bloggs</span> from <span
                                    style={{fontWeight: '900'}}>Los Angeles</span> just bought a <span
                                    style={{fontWeight: '900'}}>Mega Radio Stereo</span>!
                                </p>
                            </div>
                        </div>
                    </Card>

                </Page>
            </AppProvider>
        </div>
    );
}

export default IndexPage;