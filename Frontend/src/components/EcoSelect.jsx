import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';

const EcoSelect = ({ name, value, options, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    
    const selectedOption = options.find(o => o.value === value) || options[0];

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (val) => {
        onChange({ target: { name, value: val } });
        setIsOpen(false);
    };

    return (
        <div className="dropdown w-100" ref={dropdownRef}>
            <button
                className="btn bg-white border w-100 text-start d-flex justify-content-between align-items-center py-2 px-3 shadow-sm"
                type="button"
                style={{ 
                    borderRadius: '10px', 
                    minHeight: '48px', 
                    border: '1px solid #e2e8f0',
                    boxShadow: isOpen ? '0 0 0 0.25rem rgba(0, 121, 107, 0.15)' : 'none'
                }}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="text-dark fw-medium">{selectedOption.label}</span>
                <ChevronDown 
                    size={18} 
                    className="text-muted transition-all" 
                    style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} 
                />
            </button>
            <ul 
                className={clsx("dropdown-menu w-100 shadow-lg border-0 mt-1 py-2", isOpen && "show")}
                style={{ 
                    borderRadius: '12px', 
                    maxHeight: '250px', 
                    overflowY: 'auto',
                    zIndex: 1050 
                }}
            >
                {options.map((opt) => (
                    <li key={opt.value}>
                        <button
                            className={clsx(
                                "dropdown-item py-2 px-3 transition-all", 
                                value === opt.value ? "bg-mint text-success fw-bold" : "text-dark"
                            )}
                            type="button"
                            onClick={() => handleSelect(opt.value)}
                        >
                            {opt.label}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EcoSelect;
