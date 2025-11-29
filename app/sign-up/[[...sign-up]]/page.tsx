import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="pt-32 pb-20">
      <div className="container-custom flex items-center justify-center">
        <div className="rounded-[32px] border border-white/10 bg-white/5 p-6 sm:p-8 backdrop-blur-2xl shadow-[0_40px_120px_rgba(0,0,0,0.4)]">
          <SignUp
            appearance={{
              elements: {
                card: 'bg-transparent shadow-none border-0 text-white',
                headerTitle: 'text-white',
                headerSubtitle: 'text-white/60',
                formButtonPrimary: 'bg-[#009de0] hover:bg-[#00b4ff] text-white',
                footer: 'text-white/60',
                socialButtonsBlockButton: 'bg-white/10 border-white/10 text-white',
                dividerLine: 'bg-white/10',
                dividerText: 'text-white/40',
                formFieldInput: 'bg-white/5 border border-white/10 text-white',
                formFieldLabel: 'text-white/70',
                formFieldInputShowPasswordButton: 'text-white/70',
                formFieldAction: 'text-[#00d4ff] hover:text-white',
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
