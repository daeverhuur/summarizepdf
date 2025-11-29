import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="pt-32 pb-20">
      <div className="container-custom flex items-center justify-center">
        <div className="rounded-[32px] border border-slate-200 bg-white p-6 sm:p-8 shadow-lg">
          <SignUp
            appearance={{
              elements: {
                card: 'bg-transparent shadow-none border-0 text-slate-900',
                headerTitle: 'text-slate-900',
                headerSubtitle: 'text-slate-600',
                formButtonPrimary: 'bg-[#009de0] hover:bg-[#0077b3] text-white',
                footer: 'text-slate-600',
                socialButtonsBlockButton: 'bg-slate-100 border-slate-200 text-slate-900',
                dividerLine: 'bg-slate-200',
                dividerText: 'text-slate-500',
                formFieldInput: 'bg-white border border-slate-300 text-slate-900',
                formFieldLabel: 'text-slate-700',
                formFieldInputShowPasswordButton: 'text-slate-700',
                formFieldAction: 'text-[#009de0] hover:text-[#0077b3]',
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
