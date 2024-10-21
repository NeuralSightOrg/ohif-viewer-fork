import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const View = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const url = process.env.REACT_APP_API_BASE;

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');
  console.log(token);

  useEffect(() => {
    const authenticateAndNavigate = async () => {
      if (token) {
        try {
          const requestOptions = {
            method: 'GET',
            redirect: 'follow',
          };

          const response = await fetch(`${url}/share/study/${token}`, requestOptions);
          console.log(response);

          if (!response.ok) {
            throw new Error('Failed to authenticate');
          }

          if (localStorage.getItem('x-orthanc-label')) {
            localStorage.removeItem('x-orthanc-label');
          }

          const result = await response.text();
          console.log(response);

          const res = JSON.parse(result);
          console.log(res);

          const studyUID = res?.study_id;
          const label = res?.hospital_label;

          // Save the new label and token if needed
          localStorage.setItem('x-orthanc-label', label);
          localStorage.setItem('authToken', token); // TODO: redesign the flow for guest users 

          // Redirect back to the dashboard with the study UID
          navigate(`/viewer?StudyInstanceUIDs=${studyUID}`);
        } catch (error) {
          console.error('Something went wrong!', error);
          alert('Something went wrong. Please try again!');
          window.location.href = '/';
        }
      }
    };

    authenticateAndNavigate();
  }, [token, navigate, location.search, url]);

  return null;
};

export default View;
