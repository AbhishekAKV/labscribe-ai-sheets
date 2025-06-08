
import React, { useState } from 'react';
import Header from '../components/Header';
import ConfigurationPanel from '../components/ConfigurationPanel';
import SectionsPanel from '../components/SectionsPanel';
import OutputPanel from '../components/OutputPanel';
import { FormData, Section } from '../types';

const Index = () => {
  const [formData, setFormData] = useState<FormData>({
    subject: '',
    experiment: '',
    apiKey: '',
    model: 'command',
    customPrompt: ''
  });

  const [sections, setSections] = useState<Section[]>([
    {
      id: '1',
      name: 'Introduction & Objectives',
      content: '',
      images: []
    },
    {
      id: '2',
      name: 'Materials & Equipment',
      content: '',
      images: []
    },
    {
      id: '3',
      name: 'Procedure',
      content: '',
      images: []
    },
    {
      id: '4',
      name: 'Results & Observations',
      content: '',
      images: []
    },
    {
      id: '5',
      name: 'Analysis & Discussion',
      content: '',
      images: []
    },
    {
      id: '6',
      name: 'Conclusion',
      content: '',
      images: []
    }
  ]);

  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const generateLabSheet = async () => {
    if (!formData.apiKey) {
      alert('Please enter your Cohere API key');
      return;
    }

    setIsLoading(true);
    
    try {
      const subject = formData.subject || 'General Science';
      const experiment = formData.experiment || 'Laboratory Experiment';
      
      let prompt = `You are an expert laboratory instructor and scientific writer. Create a comprehensive, detailed laboratory sheet for a ${subject} experiment titled "${experiment}".

Generate a well-structured lab sheet that includes the following sections in order:`;

      sections.forEach((section, index) => {
        prompt += `\n\n${index + 1}. ${section.name}`;
        if (section.content) {
          prompt += `\n   Requirements: ${section.content}`;
        }
        if (section.images.length > 0) {
          prompt += `\n   Note: Include space for ${section.images.length} image(s) in this section`;
        }
      });

      if (formData.customPrompt) {
        prompt += `\n\nAdditional Instructions:\n${formData.customPrompt}`;
      }

      prompt += `\n\nFormat Requirements:
- Use clear, professional headings for each section
- Include detailed, practical instructions suitable for students
- Add safety considerations where relevant
- Make content educational and comprehensive
- Use proper laboratory terminology
- Structure content in a logical, easy-to-follow format
- Include specific details that make this experiment unique and valuable

Generate the complete lab sheet now:`;

      const response = await fetch('https://api.cohere.ai/v1/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${formData.apiKey}`,
          'Content-Type': 'application/json',
          'Cohere-Version': '2022-12-06'
        },
        body: JSON.stringify({
          model: formData.model,
          prompt: prompt,
          max_tokens: 2048,
          temperature: 0.7,
          k: 0,
          stop_sequences: [],
          return_likelihoods: 'NONE'
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`API Error: ${response.status} - ${errorData.message || response.statusText}`);
      }

      const data = await response.json();
      const generatedContent = data.generations[0].text;
      setOutput(generatedContent);
      
    } catch (error: any) {
      let errorMessage = `Error generating lab sheet: ${error.message}\n\n`;
      
      if (error.message.includes('401') || error.message.includes('invalid_api_token')) {
        errorMessage += `Authentication Error: Please check your Cohere API key.
• Make sure your API key is correct
• Verify it's active in your Cohere dashboard
• Check if you've exceeded your usage limits`;
      } else if (error.message.includes('429')) {
        errorMessage += `Rate Limit Error:
• You may have exceeded your rate limit
• Check your Cohere dashboard for usage details
• Try again in a few minutes`;
      } else if (error.message.includes('400')) {
        errorMessage += `Request Error: There might be an issue with the request format.
• Try shortening your prompt
• Check if all required fields are filled`;
      } else {
        errorMessage += `Please check:
1. Your Cohere API key is valid and active
2. You have available credits/usage in your Cohere account
3. Your internet connection is stable

Get your API key from: https://dashboard.cohere.ai/api-keys

Note: Cohere offers generous free tiers for getting started!`;
      }
      
      setOutput(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-x-hidden">
      {/* Animated background texture */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse" />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto p-5">
        <Header />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
          <ConfigurationPanel
            formData={formData}
            onFormDataChange={updateFormData}
            onGenerate={generateLabSheet}
          />
          
          <SectionsPanel
            sections={sections}
            onSectionsChange={setSections}
            onGenerate={generateLabSheet}
          />
          
          <OutputPanel
            content={output}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
