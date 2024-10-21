import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@ohif/ui';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { FileText, Plus, Send, X, Edit2, Save } from 'lucide-react';

function ReportModalContent({ onClose }) {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [newReportText, setNewReportText] = useState('');
  const [isAddingNewReport, setIsAddingNewReport] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const baseUrl = process.env.REACT_APP_API_BASE;
  const observer = useRef();
  const token = localStorage.getItem('authToken');

  const urlParams = new URLSearchParams(window.location.search);
  const studyInstanceUIDs = urlParams.get('StudyInstanceUIDs');
  const STUDY_ID = studyInstanceUIDs ? studyInstanceUIDs.split(',')[0] : '';

  const lastReportElementRef = useCallback(
    node => {
      if (isLoading) {
        return;
      }
      if (observer.current) {
        observer.current.disconnect();
      }
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          setPage(prevPage => prevPage + 1);
        }
      });
      if (node) {
        observer.current.observe(node);
      }
    },
    [isLoading, hasMore]
  );

  useEffect(() => {
    fetchReports();
  }, [page]);

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${baseUrl}/reports/listall?studyid=${STUDY_ID}&page=${page}&limit=20`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (Array.isArray(data)) {
        setReports(prevReports => [...prevReports, ...data]);
        setHasMore(data.length === 20);
      } else {
        console.error('Unexpected data format:', data);
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  };

  const submitReport = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${baseUrl}/reports/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          study_id: STUDY_ID,
          content: newReportText,
          // PatientName: 'Patient Name',
        }),
      });
      if (response.ok) {
        const newReport = await response.json();

        setReports(prevReports => [newReport, ...prevReports]);
        setNewReportText('');
        setIsAddingNewReport(false);
      } else {
        console.error('Failed to submit report:', await response.text());
      }
    } catch (error) {
      console.error('Error submitting report:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateReport = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${baseUrl}/reports/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: selectedReport.ID,
          study_id: STUDY_ID,
          content: selectedReport.Content,
        }),
      });
      if (response.ok) {
        const updatedReport = await response.json();
        setReports(prevReports =>
          prevReports.map(report => (report.ID === updatedReport.ID ? updatedReport : report))
        );
        setIsEditing(false);
      } else {
        console.error('Failed to update report:', await response.text());
      }
    } catch (error) {
      console.error('Error updating report:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
      ['link', 'image'],
      ['clean'],
    ],
  };

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
  ];

  return (
    <div className="flex h-full w-full rounded-lg bg-gray-100 p-6 shadow-lg">
      <div className="w-1/4 border-r border-gray-300 pr-6">
        <h3 className="mb-4 flex items-center text-xl font-bold text-gray-800">
          <FileText className="mr-2" />
          Reports
        </h3>
        <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
          {reports.map((report, index) => (
            <div
              key={index}
              ref={index === reports.length - 1 ? lastReportElementRef : null}
              onClick={() => {
                setSelectedReport(report);
                setIsAddingNewReport(false);
                setIsEditing(false);
              }}
              className={`mb-2 cursor-pointer rounded-md p-2 transition duration-300 ease-in-out ${
                selectedReport?.ID === report.ID
                  ? 'bg-blue-500 text-black'
                  : 'bg-white text-black hover:bg-gray-200'
              }`}
            >
              <div className="font-bold">{report.PatientName || 'No Patient Name'}</div>
              {/* <div className="text-sm">{report.StudyID}</div> */}
              <div className="text-sm">
                Created:{' '}
                {new Date(report.CreatedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
            </div>
          ))}
          {isLoading && <div className="py-2 text-center">Loading...</div>}
        </div>
        <Button
          onClick={() => {
            setIsAddingNewReport(true);
            setSelectedReport(null);
            setIsEditing(false);
          }}
          className="mt-4 flex w-full items-center justify-center rounded-md bg-green-500 px-4 py-2 text-white transition duration-300 ease-in-out hover:bg-green-600"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Report
        </Button>
      </div>
      <div className="flex w-3/4 flex-col pl-6">
        {isAddingNewReport ? (
          <>
            <h3 className="mb-4 flex items-center text-xl font-bold text-gray-800">
              <Send className="mr-2" />
              New Report
            </h3>
            <div className="mb-4 flex-grow rounded-md bg-white p-4 text-black shadow">
              <ReactQuill
                theme="snow"
                value={newReportText}
                onChange={setNewReportText}
                modules={modules}
                formats={formats}
                className="h-full text-black"
              />
            </div>
          </>
        ) : selectedReport ? (
          <>
            <div className="mb-1 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800 ">
                {selectedReport.PatientName || 'No Patient Name'}sss
              </h3>
              <Button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center rounded-md bg-blue-500 px-2 text-white transition duration-300 ease-in-out hover:bg-blue-600"
              >
                {isEditing ? (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save
                  </>
                ) : (
                  <>
                    <Edit2 className="mr-2 h-4 w-4" />
                    Edit
                  </>
                )}
              </Button>
            </div>
            <div className="mb-4 text-sm text-black">
              <p className="">
                Created:{' '}
                {new Date(selectedReport.CreatedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              <p className="">
                Updated:{' '}
                {new Date(selectedReport.UpdatedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div className="flex-grow overflow-y-auto rounded-md bg-white p-4 text-black text-white shadow">
              {isEditing ? (
                <ReactQuill
                  theme="snow"
                  value={selectedReport.Content}
                  onChange={content => setSelectedReport({ ...selectedReport, Content: content })}
                  modules={modules}
                  formats={formats}
                  className="h-full text-black"
                />
              ) : (
                <div
                  className="ql-editor text-black"
                  dangerouslySetInnerHTML={{ __html: selectedReport.Content }}
                />
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-grow items-center justify-center text-gray-500">
            Select a report or create a new one
          </div>
        )}
        <div className="mt-4 flex justify-end">
          {isAddingNewReport && (
            <Button
              onClick={submitReport}
              disabled={isLoading || !newReportText.trim()}
              className="mr-4 flex items-center rounded-md bg-blue-500 px-4 py-2 text-white transition duration-300 ease-in-out hover:bg-blue-600"
            >
              {isLoading ? 'Submitting...' : 'Submit Report'}
              <Send className="ml-2 h-4 w-4" />
            </Button>
          )}
          {isEditing && (
            <Button
              onClick={updateReport}
              disabled={isLoading}
              className="mr-4 flex items-center rounded-md bg-blue-500 px-4 py-2 text-white transition duration-300 ease-in-out hover:bg-blue-600"
            >
              {isLoading ? 'Updating...' : 'Update Report'}
              <Save className="ml-2 h-4 w-4" />
            </Button>
          )}
          <Button
            onClick={onClose}
            className="flex items-center rounded-md bg-gray-300 px-4 py-2 text-gray-800 transition duration-300 ease-in-out hover:bg-gray-400"
          >
            Close
            <X className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ReportModalContent;
