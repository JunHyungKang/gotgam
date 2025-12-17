"use client"

import DaumPostcodeEmbed from 'react-daum-postcode';

interface AddressSearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete: (data: any) => void;
}

export default function AddressSearchModal({ isOpen, onClose, onComplete }: AddressSearchModalProps) {
    if (!isOpen) return null;

    const handleComplete = (data: any) => {
        let fullAddress = data.address;
        let extraAddress = '';

        if (data.addressType === 'R') {
            if (data.bname !== '') {
                extraAddress += data.bname;
            }
            if (data.buildingName !== '') {
                extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
            }
            fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
        }

        onComplete({
            address: fullAddress,
            zonecode: data.zonecode
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden relative">
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-lg font-bold text-gray-800">주소 검색</h3>
                    <button 
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 font-bold text-xl"
                    >
                        &times;
                    </button>
                </div>
                <div className="h-[500px]">
                    <DaumPostcodeEmbed 
                        onComplete={handleComplete} 
                        style={{ width: '100%', height: '100%' }}
                    />
                </div>
            </div>
        </div>
    );
}
