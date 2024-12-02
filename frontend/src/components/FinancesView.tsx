import React from "react";
import BudgetProgressBar from "@/components/BudgetProgressBar";
import SponsorsList from "@/components/SponsorsList";

interface FinancesViewProps {
    currentClub: { club_id: number } | null;
}

const FinancesView: React.FC<FinancesViewProps> = ({ currentClub }) => {
    return (
        <>
            <div className="bg-white rounded shadow p-4 mb-4">
                {/* Budget Overview */}
                <div className="mb-2">
                    {currentClub ? (
                        <BudgetProgressBar clubId={currentClub.club_id} />
                    ) : (
                        <p className="text-gray-600 italic">Select a club to view its finances.</p>
                    )}
                </div>
            </div>


                {/* Sponsors Section */}
                {currentClub ? (
                    <SponsorsList clubId={currentClub.club_id} />
                ) : (
                    <p className="text-gray-600 italic">Select a club to view its sponsors.</p>
                )}
        </>

    );
};

export default FinancesView;
