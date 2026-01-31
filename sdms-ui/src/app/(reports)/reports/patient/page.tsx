"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import OptionComponent from "./option-form/OptionComponent";
import TableComponent from "./TableComponent";
import { AuthGuard } from "@/components/utility-components/auth-guard";
import { getData } from "./action";

export default function ReportPanelPage() {
  return (
     <AuthGuard>
        <ReportPanel />
     </AuthGuard>
  );
}

const ReportPanel = () => {
  const [showTable, setShowTable] = useState(false);
  const [tabledata, setTabledata] = useState([]);
  const [searchType, setSearchType] = useState("id");

  // useTransition hook
  const [isPending, startTransition] = useTransition();

  const handleOnShow = (data: any) => {
    console.log(data);
    startTransition(async () => {
      try {
        const result = await getData(data);
        if (result?.data) {
          setTabledata(result.data);
          setShowTable(true);
        }
      } catch (error) {
        console.error(error);
      }
    });
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#1e1e2f] to-[#0f0f1a] flex flex-col p-6 text-white overflow-auto">
      {/* Starting of Page Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Link href="/dashboard/reports">
            <Button
              variant="ghost"
              size="sm"
              className="bg-white/10 hover:bg-white/20 text-white backdrop-blur border border-white/20"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
            </Button>
          </Link>

          <h3 className="text-1xl md:text-2xl font-bold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
            Reporting Panel
          </h3>
        </div>
      </div>

      {/* End of Header */}


      {/* Search Options */}
      <OptionComponent
          onShow={handleOnShow}
      />

      {/* Loading Spinner */}
      {isPending && (
        <div className="flex flex-col items-center justify-center mt-10 space-y-2">
          <Loader2 className="h-8 w-8 text-white animate-spin" />
          <span className="text-sm text-gray-300">Loading data...</span>
        </div>
      )}

      {/* Table Component */}
      {showTable && !isPending && (
        <div className="mt-10">
          <TableComponent data={tabledata} />
        </div>
      )}
    </div>
  );
};
