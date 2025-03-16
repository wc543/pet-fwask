import React, { forwardRef, useContext } from 'react';
import { Link, useNavigate, LinkProps } from 'react-router-dom';
import { AuthContext } from './AuthContext';

interface ProtectedLinkProps extends LinkProps {
  message?: string;
}

const ProtectedLink = forwardRef<HTMLAnchorElement, ProtectedLinkProps>(
  ({ message, ...linkProps }, ref) => {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    if (!auth) {
      throw new Error("ProtectedLink must be used within an AuthProvider");
    }
    const { user } = auth;

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      if (!user) {
        e.preventDefault();
        alert(message || "You must login to continue.");
        navigate("/login");
      }
    };

    return <Link ref={ref} {...linkProps} onClick={handleClick} />;
  }
);

export default ProtectedLink;