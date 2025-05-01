import React from 'react';

interface NodeComponentProps {
  photo: string;
  name: string;
  birthDate: string;
}

const NodeComponent: React.FC<NodeComponentProps> = ({ photo, name, birthDate }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <img
          src={photo}
          alt={name}
          className="w-24 h-24 rounded-full border-4 border-blue-500 object-cover"
        />
      </div>
      <div className="mt-2 text-center text-lg font-semibold">{name}</div>
      <div className="text-sm text-gray-500">{birthDate}</div>
    </div>
  );
};

export default NodeComponent;
