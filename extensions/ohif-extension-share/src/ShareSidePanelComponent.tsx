import React, { useState } from 'react';
import { Input, Select, Button, Icon } from '@ohif/ui';
import { useLocation } from 'react-router-dom';

export default function ShareSidePanelComponent() {
  const [email, setEmail] = useState('');
  const [shareType, setShareType] = useState(null);
  const [duration, setDuration] = useState(null);
  const [sharedLink, setSharedLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const studyId = queryParams.get('StudyInstanceUIDs');
  const baseUrl = process.env.REACT_APP_API_BASE;

  const shareTypeOptions = [
    { value: 'patient', label: 'Patient' },
    { value: 'doctor', label: 'Doctor' },
  ];

  const durationOptions = [
    { value: '1d', label: '1 Day' },
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
  ];

  const token = localStorage.getItem('authToken');

  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validate the inputs
    if (!email || !shareType?.value || !duration?.value) {
      setError('Please fill in all fields before submitting.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/share/study`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          study_id: studyId,
          shared_to_email: email,
          share_type: shareType?.value,
          duration: duration?.value,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate share link');
      }

      const data = await response.json();
      setSharedLink(data.link);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sharedLink);
    setShowTooltip(true);
    setTimeout(() => {
      setShowTooltip(false);
    }, 5000);
  };

  const resetForm = () => {
    setEmail('');
    setShareType(null);
    setDuration(null);
    setSharedLink('');
    setError('');
  };

  return (
    <div className="p-4">
      <h2 className="text-md mb-4 text-center font-bold text-white">Share Study</h2>
      <form className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
            Email
          </label>
          <Input
            type="email"
            id="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full"
            onFocus={undefined}
            autoFocus={undefined}
            onKeyPress={undefined}
            onKeyDown={undefined}
            readOnly={undefined}
            disabled={undefined}
            labelChildren={undefined}
            label={undefined}
          />
        </div>
        <div>
          <label htmlFor="shareType" className="mb-1 block text-sm font-medium text-gray-700">
            Share Type
          </label>
          <Select
            id="shareType"
            options={shareTypeOptions}
            value={shareType}
            isClearable={false}
            onChange={selectedOption => setShareType(selectedOption)}
            className="w-full"
          />
        </div>
        <div>
          <label htmlFor="duration" className="mb-1 block text-sm font-medium text-gray-700">
            Duration
          </label>
          <Select
            id="duration"
            options={durationOptions}
            value={duration}
            isClearable={false}
            onChange={selectedOption => setDuration(selectedOption)}
            className="w-full"
          />
        </div>
        {!sharedLink && (
          <Button
            disabled={isLoading}
            className="bg-primary-main hover:bg-primary-light active:bg-customblue-20 text-primary-light float-right rounded-md p-1 hover:text-black"
            type={'primary'}
            onClick={handleSubmit}
          >
            {isLoading ? 'Generating...' : 'Share'}
          </Button>
        )}
      </form>
      {error && (
        <div
          className="clear-none mt-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700"
          role="alert"
        >
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}
      {sharedLink && !showTooltip && (
        <div className="clear-none mt-4 rounded bg-gray-100 p-4">
          <p className="mb-2">Share Link:</p>
          <Input
            type="text"
            value={sharedLink}
            readOnly
            className="mr-2 flex-grow"
            hidden
            id={undefined}
            label={undefined}
            onChange={undefined}
            onFocus={undefined}
            autoFocus={undefined}
            onKeyPress={undefined}
            onKeyDown={undefined}
            disabled={undefined}
            labelChildren={undefined}
          />
          <div className="flex items-center justify-center space-x-2">
            <Button onClick={copyToClipboard} className="text-blue-600">
              <Icon name="link" className="mr-1" />
              Copy link
            </Button>
            <Button type="secondary" onClick={resetForm} className="text-red-600">
              <Icon name="close" className="mr-1" />
              Done
            </Button>
          </div>
        </div>
      )}
      {showTooltip && (
        <div className="clear-none mt-4 rounded bg-gray-100 p-4">
          <div className="flex items-center">
            <span className="ml-2 text-black">Link Copied!</span>
          </div>
        </div>
      )}
    </div>
  );
}
