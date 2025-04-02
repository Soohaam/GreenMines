const { GoogleGenerativeAI } = require('@google/generative-ai'); // Gemini SDK
require('dotenv').config();

// Gemini API initialization
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY2); // Replace with your Gemini API Key
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash", // Use your desired Gemini model
    maxTokens: 4500 // Adjust this based on your required token limit
});

// AFOLU Controller
exports.afolu = async (req, res) => {
    const { landSize, currentLandUse, carbonStock, clearingMethod, climateDescription, newLandUse } = req.body;

    // Validation for required fields
    if (!landSize || !currentLandUse || !carbonStock || !clearingMethod || !climateDescription || !newLandUse) {
        return res.status(400).json({
            status: 'error',
            message: 'All fields are required: landSize, currentLandUse, carbonStock, clearingMethod, climateDescription, newLandUse.'
        });
    }

    try {
        // Construct a context-rich professional prompt for the AFOLU use case
        const afoluPrompt = `
        Context:
        - You are an expert in land use, environmental sustainability, and climate action.
        - Provide insights for estimating the environmental impact of land clearing.

        User Data:
        - Land Size: ${landSize} hectares
        - Current Land Use: ${currentLandUse}
        - Carbon Stock: ${carbonStock} tons per hectare
        - Clearing Method: ${clearingMethod}
        - Climate Description: ${climateDescription}
        - New Land Use: ${newLandUse}

        Goals:
        - Quantify the carbon emissions caused by clearing the land, considering factors such as biomass loss, soil disturbance, and method of clearing.
        - Assess the overall environmental impact from the land clearing process.
        - Recommend mitigation strategies to reduce emissions.
        - Suggest alternative methods for land clearing that align with sustainability goals.

        Response Format:
        - Summary of the estimated environmental impact.
        - Detailed explanation of emissions calculations and assumptions.
        - Estimated Time for Land Recovery
        - Practical mitigation strategies and alternative clearing methods.
        - Actionable next steps or resources for implementing the recommendations.
        `;

        // Call the Gemini API to generate a response
        const result = await model.generateContent(afoluPrompt);

        // Extract and format the AI response
        const aiResponse = result.response.text();
        const formattedResponse = formatResponse(aiResponse);

        // Send response to the client
        res.json({
            status: 'success',
            input: { landSize, currentLandUse, carbonStock, clearingMethod, climateDescription, newLandUse },
            response: formattedResponse
        });
    } catch (error) {
        console.error('Error generating AFOLU insights:', error.message);
        res.status(500).json({
            status: 'error',
            message: 'AFOLU insight generation failed.',
            errorDetails: error.message
        });
    }
};

// Enhanced function to format AI responses
function formatResponse(aiResponse) {
    // Normalize line breaks and remove extra whitespace
    aiResponse = aiResponse.replace(/\\n/g, '\n').trim();
    
    // Handle markdown-style headings (# Heading, ## Heading, etc)
    aiResponse = aiResponse.replace(/^(#{1,6})\s+(.+)$/gm, (match, hashes, content) => {
        const level = Math.min(hashes.length + 2, 6); // Convert # to h3, ## to h4, etc.
        return `<h${level}>${content.trim()}</h${level}>`;
    });
    
    // Split the response into sections but preserve correct structure
    const sections = aiResponse.split(/\n{2,}/);
    
    let formattedResponse = '';
    let inList = false;
    
    sections.forEach(section => {
        section = section.trim();
        
        if (!section) return; // Skip empty sections
        
        // Handle section headers (bolded text or text with colons)
        if (section.match(/^\*\*(.+)\*\*$/) || section.match(/^[A-Za-z\s]+:$/)) {
            const headerText = section.replace(/\*\*/g, '').replace(/:$/, '').trim();
            formattedResponse += `<h3>${headerText}</h3>`;
        }
        // Handle multi-line bullet lists
        else if (/^[-*]\s+/.test(section)) {
            // Start or continue a list
            if (!inList) {
                formattedResponse += '<ul>';
                inList = true;
            }
            
            // Process each bullet point
            const bulletPoints = section.split(/\n/).filter(line => line.trim());
            bulletPoints.forEach(point => {
                // Check if it's actually a bullet point
                if (/^[-*]\s+/.test(point)) {
                    const content = point.replace(/^[-*]\s+/, '').trim();
                    formattedResponse += `<li>${content}</li>`;
                } else {
                    // If not a bullet point but part of previous list item, append to the last list item
                    formattedResponse = formattedResponse.replace(/<\/li>$/, ` ${point.trim()}</li>`);
                }
            });
        }
        // Handle numbered lists
        else if (/^\d+\.\s+/.test(section)) {
            // Close any open unordered list
            if (inList) {
                formattedResponse += '</ul>';
                inList = false;
            }
            
            // Start an ordered list
            formattedResponse += '<ol>';
            
            // Process each numbered point
            const numberedPoints = section.split(/\n/).filter(line => line.trim());
            numberedPoints.forEach(point => {
                if (/^\d+\.\s+/.test(point)) {
                    const content = point.replace(/^\d+\.\s+/, '').trim();
                    formattedResponse += `<li>${content}</li>`;
                } else {
                    // If not a numbered point but part of previous list item, append to the last list item
                    formattedResponse = formattedResponse.replace(/<\/li>$/, ` ${point.trim()}</li>`);
                }
            });
            
            formattedResponse += '</ol>';
        }
        // Handle tables if present (markdown style tables)
        else if (section.includes('|') && section.includes('\n') && section.match(/\|[\s-]+\|/)) {
            const tableRows = section.split('\n').filter(row => row.trim());
            
            formattedResponse += '<table class="table table-bordered">';
            
            // Process each row
            let isHeader = true;
            tableRows.forEach((row, index) => {
                // Skip separator row (---|---|---)
                if (row.match(/^\|[\s-]+\|$/)) return;
                
                const cells = row.split('|')
                    .filter((cell, i, arr) => i !== 0 && i !== arr.length - 1 || cell.trim()) // Remove empty first/last cells
                    .map(cell => cell.trim());
                
                if (isHeader && index === 0) {
                    formattedResponse += '<thead><tr>';
                    cells.forEach(cell => {
                        formattedResponse += `<th>${cell}</th>`;
                    });
                    formattedResponse += '</tr></thead><tbody>';
                    isHeader = false;
                } else {
                    formattedResponse += '<tr>';
                    cells.forEach(cell => {
                        formattedResponse += `<td>${cell}</td>`;
                    });
                    formattedResponse += '</tr>';
                }
            });
            
            formattedResponse += '</tbody></table>';
        }
        // Handle code blocks
        else if (section.match(/```[\s\S]+```/)) {
            const codeContent = section.replace(/```(?:\w+)?\n([\s\S]+)```/, '$1').trim();
            formattedResponse += `<pre><code>${codeContent}</code></pre>`;
        }
        // Regular paragraphs
        else {
            // Close any open unordered list before adding a paragraph
            if (inList) {
                formattedResponse += '</ul>';
                inList = false;
            }
            
            // Handle inline formatting
            let formattedParagraph = section
                .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>') // Bold
                .replace(/\*([^*]+)\*/g, '<em>$1</em>') // Italic
                .replace(/`([^`]+)`/g, '<code>$1</code>'); // Inline code
                
            formattedResponse += `<p>${formattedParagraph}</p>`;
        }
    });
    
    // Ensure any open list is closed
    if (inList) {
        formattedResponse += '</ul>';
    }
    
    return formattedResponse;
}