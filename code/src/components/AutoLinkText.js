import { Text } from 'native-base';
import React from 'react';
import { ThemeContext } from '../context/initialContext';
// custom components and helper files
import { decodeHTML, stripHTML } from '../helpers/helpers';
import * as WebBrowser from 'expo-web-browser';

//Assumes htmlString only has one anchor tag in it
function extractHrefByText(htmlString)
{
    // Regex matches the anchor tag, captures the href
    const regex = new RegExp(`<a[^>]*href=["']([^"']+)["'][^>]*>.*</a>`, 'i');
    const match = htmlString.match(regex);
    
    // Return the captured href group if found, otherwise null
    return match ? match[1] : null;
}

export function AutoLinkText(data) {
    const {textColor, backgroundColor} = React.useContext(ThemeContext);
    let raw = data.text;
    //manually stripping outer html tag
    //since splitting will break those up
    const match = raw.match(/^<[^>]+>([\s\S]*)<\/[^>]+>$/);
    let stripped = match ? match[1] : raw;

    //using regex to identify parts within 
    const anchorRegex = /(<a\b[^>]*>.*?<\/a>)/gi;
    let parts = stripped.split(anchorRegex);

    return (
        <Text>
            {parts.map((part, index) => {
                    let isLink = part.includes("<a href");
                    let link = extractHrefByText(part);

                    return (
                        <>
                        {isLink ? 
                            (
                                <Text 
                                    color="blue.500" 
                                    underline
                                    onPress={async () =>
                                        {
                                            const browserParams = {
                                                enableDefaultShareMenuItem: false,
                                                presentationStyle: 'automatic',
                                                showTitle: false,
                                                toolbarColor: backgroundColor,
                                                controlsColor: textColor,
                                                secondaryToolbarColor: backgroundColor,
                                            };
                                            await WebBrowser.openBrowserAsync(link, browserParams);
                                        }
                                    }>
                                    {stripHTML(decodeHTML(part))}
                                </Text>
                            ) :
                            (
                                <Text>
                                        {stripHTML(decodeHTML(part))}
                                </Text>
                            )
                        }
                        </>
                    )
            })}
        </Text>
    );
};