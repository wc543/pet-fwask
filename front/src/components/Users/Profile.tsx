import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('jwt');
        if (!token) {
          setError('Not authenticated');
          setLoading(false);
          return;
        }

        const response = await axios.get('api/users/me', {
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log("Profile API response:", response.data); // Debugging log

        if (!response.data || Object.keys(response.data).length === 0) {
          setError('User profile not found');
        } else {
          setUser(response.data);
        }

      } catch (err) {
        setError('Failed to load user profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div>
      <h2>Profile</h2>
      {loading ? <p>Loading...</p> : error ? <p style={{ color: 'red' }}>{error}</p> : (
        <div>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </div>
      )}
    </div>
  );
};

export default Profile;
