import jsPDF from 'jspdf';

/**
 * Professional PDF Export for ReviewLens
 * Creates a multi-page business report with detailed analysis
 */
export const exportToPDF = async (data) => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - (2 * margin);
  
  // Color palette matching the app
  const colors = {
    primary: [59, 130, 246],      // Blue
    success: [34, 197, 94],        // Green
    danger: [239, 68, 68],         // Red
    warning: [251, 191, 36],       // Yellow
    gray: [107, 114, 128],         // Gray
    darkGray: [31, 41, 55],        // Dark gray
    lightGray: [243, 244, 246],    // Light gray
    white: [255, 255, 255]
  };

  let currentPage = 1;

  // Helper: Add footer to current page
  const addFooter = () => {
    const footerY = pageHeight - 10;
    pdf.setFontSize(8);
    pdf.setTextColor(...colors.gray);
    pdf.setFont('helvetica', 'normal');
    
    // Left: Copyright
    pdf.text('(c) 2026 ReviewLens. Powered by IBM watsonx.ai', margin, footerY);
    
    // Center: Hackathon
    pdf.text('Built for IBM Bob Dev Day Hackathon 2026', pageWidth / 2, footerY, { align: 'center' });
    
    // Right: Page number
    pdf.text(`Page ${currentPage}`, pageWidth - margin, footerY, { align: 'right' });
  };

  // Helper: Add new page with footer
  const addNewPage = () => {
    addFooter();
    pdf.addPage();
    currentPage++;
    return margin;
  };

  // Helper: Add text with word wrap
  const addText = (text, x, y, maxWidth, fontSize = 10, color = colors.darkGray, style = 'normal') => {
    pdf.setFontSize(fontSize);
    pdf.setTextColor(...color);
    pdf.setFont('helvetica', style);
    const lines = pdf.splitTextToSize(text, maxWidth);
    pdf.text(lines, x, y);
    return y + (lines.length * fontSize * 0.5);
  };

  // Helper: Draw box
  const drawBox = (x, y, width, height, fillColor, borderColor = null) => {
    pdf.setFillColor(...fillColor);
    if (borderColor) {
      pdf.setDrawColor(...borderColor);
      pdf.setLineWidth(0.5);
      pdf.rect(x, y, width, height, 'FD');
    } else {
      pdf.rect(x, y, width, height, 'F');
    }
  };

  // Helper: Draw horizontal line
  const drawLine = (y, color = colors.gray) => {
    pdf.setDrawColor(...color);
    pdf.setLineWidth(0.3);
    pdf.line(margin, y, pageWidth - margin, y);
  };

  // ==================== TITLE PAGE ====================
  
  // Blue header background
  drawBox(0, 0, pageWidth, 80, colors.primary);
  
  // Logo and title
  pdf.setFontSize(36);
  pdf.setTextColor(...colors.white);
  pdf.setFont('helvetica', 'bold');
  pdf.text('ReviewLens', pageWidth / 2, 35, { align: 'center' });
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text('AI-Powered Customer Review Analysis', pageWidth / 2, 45, { align: 'center' });
  
  pdf.setFontSize(10);
  pdf.text('Powered by IBM watsonx.ai', pageWidth / 2, 55, { align: 'center' });

  // Report title
  let yPos = 100;
  pdf.setFontSize(24);
  pdf.setTextColor(...colors.darkGray);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Customer Review Analysis Report', pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 20;
  
  // Metadata box
  const boxY = yPos;
  const boxHeight = 50;
  drawBox(margin, boxY, contentWidth, boxHeight, colors.lightGray, colors.gray);
  
  yPos = boxY + 10;
  pdf.setFontSize(11);
  pdf.setTextColor(...colors.darkGray);
  pdf.setFont('helvetica', 'normal');
  
  const date = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  pdf.text(`Report Generated: ${date}`, margin + 5, yPos);
  yPos += 8;
  pdf.text(`Total Reviews Analyzed: ${data.total_reviews_detected || 'N/A'}`, margin + 5, yPos);
  yPos += 8;
  
  const score = data.sentiment_score || 0;
  const scoreColor = score >= 7 ? colors.success : score >= 4 ? colors.warning : colors.danger;
  pdf.text('Overall Sentiment Score: ', margin + 5, yPos);
  pdf.setTextColor(...scoreColor);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`${score}/10`, margin + 60, yPos);
  
  yPos += 8;
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(...colors.darkGray);
  const sentiment = score >= 7 ? 'Positive' : score >= 4 ? 'Mixed' : 'Negative';
  pdf.text(`Sentiment: ${sentiment}`, margin + 5, yPos);

  // Key metrics summary
  yPos = boxY + boxHeight + 15;
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...colors.primary);
  pdf.text('Key Metrics at a Glance', margin, yPos);
  
  yPos += 10;
  const metricsBoxY = yPos;
  const metricsBoxHeight = 35;
  
  // Three metric boxes
  const boxWidth = (contentWidth - 10) / 3;
  
  // Pain Points box
  drawBox(margin, metricsBoxY, boxWidth, metricsBoxHeight, [254, 226, 226], colors.danger);
  pdf.setFontSize(24);
  pdf.setTextColor(...colors.danger);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`${data.pain_points?.length || 0}`, margin + boxWidth / 2, metricsBoxY + 15, { align: 'center' });
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Pain Points', margin + boxWidth / 2, metricsBoxY + 25, { align: 'center' });
  
  // Praises box
  drawBox(margin + boxWidth + 5, metricsBoxY, boxWidth, metricsBoxHeight, [220, 252, 231], colors.success);
  pdf.setFontSize(24);
  pdf.setTextColor(...colors.success);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`${data.top_praises?.length || 0}`, margin + boxWidth + 5 + boxWidth / 2, metricsBoxY + 15, { align: 'center' });
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Top Praises', margin + boxWidth + 5 + boxWidth / 2, metricsBoxY + 25, { align: 'center' });
  
  // Actions box
  drawBox(margin + (boxWidth + 5) * 2, metricsBoxY, boxWidth, metricsBoxHeight, [219, 234, 254], colors.primary);
  pdf.setFontSize(24);
  pdf.setTextColor(...colors.primary);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`${data.action_plan?.length || 0}`, margin + (boxWidth + 5) * 2 + boxWidth / 2, metricsBoxY + 15, { align: 'center' });
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Action Items', margin + (boxWidth + 5) * 2 + boxWidth / 2, metricsBoxY + 25, { align: 'center' });

  addFooter();

  // ==================== PAGE 2: EXECUTIVE SUMMARY ====================
  
  yPos = addNewPage();
  
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...colors.primary);
  pdf.text('Executive Summary', margin, yPos);
  yPos += 10;
  
  drawLine(yPos);
  yPos += 8;
  
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(...colors.darkGray);
  yPos = addText(data.summary || 'No summary available.', margin, yPos, contentWidth, 11);
  
  yPos += 10;
  
  // Sentiment interpretation
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...colors.primary);
  pdf.text('Overall Sentiment Analysis', margin, yPos);
  yPos += 8;
  
  const sentimentBoxY = yPos;
  const sentimentBoxHeight = 40;
  drawBox(margin, sentimentBoxY, contentWidth, sentimentBoxHeight, colors.lightGray, colors.gray);
  
  yPos = sentimentBoxY + 10;
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(...colors.darkGray);
  
  pdf.text('Sentiment Score:', margin + 5, yPos);
  pdf.setFontSize(20);
  pdf.setTextColor(...scoreColor);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`${score}/10`, margin + 50, yPos);
  
  yPos += 10;
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(...colors.darkGray);
  
  let interpretation = '';
  if (score >= 8) {
    interpretation = 'Excellent: Customers are highly satisfied with strong positive sentiment.';
  } else if (score >= 7) {
    interpretation = 'Good: Overall positive feedback with room for minor improvements.';
  } else if (score >= 5) {
    interpretation = 'Mixed: Balanced feedback with both strengths and areas needing attention.';
  } else if (score >= 3) {
    interpretation = 'Concerning: Significant issues identified requiring immediate action.';
  } else {
    interpretation = 'Critical: Major customer dissatisfaction requiring urgent intervention.';
  }
  
  yPos = addText(interpretation, margin + 5, yPos, contentWidth - 10, 10);

  // ==================== PAGE 3: PAIN POINTS ====================
  
  if (data.pain_points && data.pain_points.length > 0) {
    yPos = addNewPage();
    
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...colors.danger);
    pdf.text('Key Pain Points', margin, yPos);
    
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(...colors.gray);
    pdf.text(`${data.pain_points.length} issues identified`, pageWidth - margin, yPos, { align: 'right' });
    
    yPos += 10;
    drawLine(yPos);
    yPos += 10;
    
    data.pain_points.forEach((point, index) => {
      // Check if we need a new page
      if (yPos > pageHeight - 60) {
        yPos = addNewPage();
      }
      
      // Issue number badge
      drawBox(margin, yPos - 5, 8, 8, colors.danger);
      pdf.setFontSize(10);
      pdf.setTextColor(...colors.white);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${index + 1}`, margin + 4, yPos, { align: 'center' });
      
      // Issue title
      pdf.setFontSize(12);
      pdf.setTextColor(...colors.darkGray);
      pdf.setFont('helvetica', 'bold');
      pdf.text(point.issue, margin + 12, yPos);
      yPos += 8;
      
      // Severity badge
      const severityColor = point.severity === 'High' ? colors.danger : 
                           point.severity === 'Medium' ? colors.warning : colors.gray;
      drawBox(margin + 12, yPos - 4, 20, 6, severityColor);
      pdf.setFontSize(8);
      pdf.setTextColor(...colors.white);
      pdf.setFont('helvetica', 'bold');
      pdf.text(point.severity, margin + 22, yPos, { align: 'center' });
      
      // Frequency
      pdf.setFontSize(9);
      pdf.setTextColor(...colors.gray);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Frequency: ${point.frequency}`, margin + 35, yPos);
      yPos += 8;
      
      // Customer quote
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'italic');
      pdf.setTextColor(...colors.gray);
      yPos = addText(`"${point.example_quote}"`, margin + 12, yPos, contentWidth - 12, 9, colors.gray, 'italic');
      
      yPos += 8;
      
      // Light separator
      pdf.setDrawColor(...colors.lightGray);
      pdf.setLineWidth(0.5);
      pdf.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 8;
    });
  }

  // ==================== PAGE 4: TOP PRAISES ====================
  
  if (data.top_praises && data.top_praises.length > 0) {
    yPos = addNewPage();
    
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...colors.success);
    pdf.text('Top Praises', margin, yPos);
    
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(...colors.gray);
    pdf.text(`${data.top_praises.length} strengths identified`, pageWidth - margin, yPos, { align: 'right' });
    
    yPos += 10;
    drawLine(yPos);
    yPos += 10;
    
    data.top_praises.forEach((praise, index) => {
      // Check if we need a new page
      if (yPos > pageHeight - 60) {
        yPos = addNewPage();
      }
      
      // Star badge
      pdf.setFontSize(12);
      pdf.setTextColor(...colors.success);
      pdf.text('*', margin, yPos);
      
      // Strength title
      pdf.setFontSize(12);
      pdf.setTextColor(...colors.darkGray);
      pdf.setFont('helvetica', 'bold');
      pdf.text(praise.strength, margin + 8, yPos);
      yPos += 8;
      
      // Frequency
      pdf.setFontSize(9);
      pdf.setTextColor(...colors.gray);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Mentioned in: ${praise.frequency}`, margin + 8, yPos);
      yPos += 8;
      
      // Customer quote
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'italic');
      pdf.setTextColor(...colors.gray);
      yPos = addText(`"${praise.example_quote}"`, margin + 8, yPos, contentWidth - 8, 9, colors.gray, 'italic');
      
      yPos += 8;
      
      // Light separator
      pdf.setDrawColor(...colors.lightGray);
      pdf.setLineWidth(0.5);
      pdf.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 8;
    });
  }

  // ==================== PAGE 5: ACTION PLAN ====================
  
  if (data.action_plan && data.action_plan.length > 0) {
    yPos = addNewPage();
    
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...colors.primary);
    pdf.text('Recommended Action Plan', margin, yPos);
    
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(...colors.gray);
    pdf.text(`${data.action_plan.length} priority actions`, pageWidth - margin, yPos, { align: 'right' });
    
    yPos += 10;
    drawLine(yPos);
    yPos += 10;
    
    data.action_plan.forEach((action, index) => {
      // Check if we need a new page
      if (yPos > pageHeight - 60) {
        yPos = addNewPage();
      }
      
      // Priority badge
      const priorityColor = action.priority === 1 ? colors.danger :
                           action.priority === 2 ? colors.warning :
                           action.priority === 3 ? colors.primary : colors.gray;
      
      drawBox(margin, yPos - 5, 25, 8, priorityColor);
      pdf.setFontSize(9);
      pdf.setTextColor(...colors.white);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Priority ${action.priority}`, margin + 12.5, yPos, { align: 'center' });
      
      yPos += 8;
      
      // Action title
      pdf.setFontSize(11);
      pdf.setTextColor(...colors.darkGray);
      pdf.setFont('helvetica', 'bold');
      yPos = addText(action.action, margin, yPos, contentWidth, 11, colors.darkGray, 'bold');
      
      yPos += 5;
      
      // Expected impact
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(...colors.gray);
      pdf.text('Expected Impact:', margin, yPos);
      yPos += 5;
      yPos = addText(action.expected_impact, margin, yPos, contentWidth, 9, colors.gray);
      
      yPos += 8;
      
      // Light separator
      pdf.setDrawColor(...colors.lightGray);
      pdf.setLineWidth(0.5);
      pdf.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 8;
    });
  }

  // Add footer to last page
  addFooter();

  // Save the PDF
  const filename = `ReviewLens_Analysis_${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(filename);
};

// Made with Bob
