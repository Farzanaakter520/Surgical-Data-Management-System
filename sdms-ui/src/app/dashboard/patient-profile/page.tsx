'use client';

export default function PatientProfilePage() {
    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="max-w-md text-center space-y-3 rounded-2xl border border-blue-100 bg-white/80 p-6 shadow-lg backdrop-blur">
                <p className="text-lg font-semibold text-gray-700">Use a patient profile link with an ID and admission ID.</p>
                <p className="text-sm text-gray-500">Example: /dashboard/patient-profile/5/5</p>
            </div>
        </div>
    );
}