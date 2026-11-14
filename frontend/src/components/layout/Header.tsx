import { Building2, UserCircle } from "lucide-react";

export default function Header() {
    return (
        <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-8">
            <div>
                <div className="flex items-center gap-2">
                    <Building2 size={20} className="text-blue-600" />
                    <h2 className="text-xl font-semibold text-slate-900">
                        EstateIQ Dashboard
                    </h2>
                </div>

                <p className="mt-1 text-sm text-slate-500">
                    Bengaluru Housing Market Intelligence
                </p>
            </div>

            <div className="flex items-center gap-3 border-l border-slate-200 pl-5">
                <UserCircle size={30} className="text-slate-500" />

                <div className="hidden sm:block">
                    <p className="text-sm font-medium text-slate-800">
                        EstateIQ
                    </p>
                    <p className="text-xs text-slate-500">
                        Housing Analytics Platform
                    </p>
                </div>
            </div>
        </header>
    );
}