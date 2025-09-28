
interface InputFieldProps {
  label: string;
  placeholder: string;
  value: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  large?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export default function InputField({
  label,
  placeholder,
  value,
  type = 'text',
  large = false,
  onChange,
}: InputFieldProps) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-white-700 mb-2">
        {label}
      </label>
      
      {large ? (
        <textarea
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical min-h-[100px]"
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      )}
    </div>
  );
}