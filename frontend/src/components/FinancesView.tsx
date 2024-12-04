import React, { useState, useEffect } from "react";
import BudgetProgressBar from "@/components/BudgetProgressBar";
import SponsorsList from "@/components/SponsorsList";
import ExpensesList from "@/components/ExpensesList";

interface Budget {
    budget_id: number;
    fiscal_year: number;
    total_budget: number;
    spent_amount: number;
    remaining_amount: number;
}

interface FinancesViewProps {
    currentClub: { club_id: number } | null;
}

const FinancesView: React.FC<FinancesViewProps> = ({ currentClub }) => {
    const [loading, setLoading] = useState(false);
    const [budget, setBudget] = useState<Budget | null>(null);
    const [selectedYear, setSelectedYear] = useState<number | null>(null);
    const [fiscalYears, setFiscalYears] = useState<number[]>([]);


    const fetchFiscalYears = async () => {
        try {
            const response = await fetch(`http://localhost:5001/api/clubs/${currentClub?.club_id}/budget/years`);
            if (response.ok) {
                const data = await response.json();
                setFiscalYears(data.fiscal_years);
                if (data.fiscal_years.length > 0) {
                    setSelectedYear(data.fiscal_years[0]);
                }
            } else {
                console.error("Failed to fetch fiscal years");
            }
        } catch (error) {
            console.error("Error fetching fiscal years:", error);
        }
    };

    // Fetch budget details for the selected year
    const fetchBudget = async (year: number) => {
        setLoading(true);
        try {
            const response = await fetch(
                `http://localhost:5001/api/clubs/${currentClub?.club_id}/budget?fiscal_year=${year}`
            );
            if (response.ok) {
                const data = await response.json();
                setBudget(data.budget);
            } else {
                console.error("Failed to fetch budget data");
                setBudget(null);
            }
        } catch (error) {
            console.error("Error fetching budget data:", error);
            setBudget(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentClub) {
            fetchFiscalYears();
        }
    }, [currentClub]);

    useEffect(() => {
        if (selectedYear) {
            fetchBudget(selectedYear);
        }
    }, [selectedYear]);


    return (
        <>
            <div className="bg-cms_light_purple rounded shadow p-4 mb-4">
                {/* Budget Overview */}
                <div className="mb-2">
                    {currentClub ? (
                        <BudgetProgressBar 
                            clubId={currentClub?.club_id} 
                            budget={budget} 
                            fiscalYears={fiscalYears} 
                            selectedYear={selectedYear} 
                            loading={loading} 
                            setSelectedYear={setSelectedYear} 
                            setBudget={setBudget}/>
                    ) : (
                        <p className="text-gray-600 italic">Select a club to view its finances.</p>
                    )}
                </div>
            </div>

            {/* Expenses List Section */}
            <div className="mb-2">
                {currentClub ? (
                    <ExpensesList currentClub={currentClub} fiscal_year={selectedYear} />
                ) : (
                    <p className="text-gray-600 italic">Select a club to view its sponsors.</p>
                )}
            </div>

            {/* Sponsors Section */}
            <div className="mb-2">
                {currentClub ? (
                    <SponsorsList clubId={currentClub.club_id} />
                ) : (
                    <p className="text-gray-600 italic">Select a club to view its sponsors.</p>
                )}
            </div>



        </>

    );
};

export default FinancesView;
