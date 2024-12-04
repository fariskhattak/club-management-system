import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Expense {
    expense_id: number;
    expense_name: string;
    expense_amount: number;
    expense_date: string;
    description?: string;
    category?: string;
}

interface Budget {
    budget_id: number;
    fiscal_year: number;
    total_budget: number;
    spent_amount: number;
    remaining_amount: number;
}

interface Club {
    club_id: number;
}

interface ExpenseListProps {
    currentClub: Club | null;
    fiscal_year: number | null;
    budget: Budget | null;
    setBudget: (b: Budget)  => void;
}

const ITEMS_PER_PAGE = 10;

const ExpensesList: React.FC<ExpenseListProps> = ({ currentClub, fiscal_year, budget, setBudget }) => {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchParams, setSearchParams] = useState({
        expense_name: "",
        expense_date: "",
        category: "",
    });
    const [formData, setFormData] = useState({
        budget_id: 0,
        expense_name: "",
        expense_amount: "",
        expense_date: "",
        description: "",
        category: "",
    });
    const [categories, setCategories] = useState<string[]>([]);

    const fetchCategories = async () => {
        try {
            const response = await fetch("http://localhost:5001/api/expenses/categories");
            if (response.ok) {
                const data = await response.json();
                setCategories(data.categories);
            } else {
                console.error("Failed to fetch categories");
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchExpenses = async () => {
        if (!currentClub || !fiscal_year) return;

        setLoading(true);
        try {
            const response = await fetch(
                `http://localhost:5001/api/clubs/${currentClub.club_id}/expenses?fiscal_year=${fiscal_year}`
            );
            if (response.ok) {
                const data = await response.json();
                setExpenses(data.expenses);
                setFilteredExpenses(data.expenses || []);
            } else {
                console.error("Failed to fetch expenses:", response.statusText);
            }
        } catch (error) {
            console.error("Error fetching expenses:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSearchParams((prev) => ({ ...prev, [name]: value }));
    };

    const handleSearch = async () => {
        if (!currentClub) return;

        setLoading(true);
        try {
            const query = new URLSearchParams(searchParams).toString();
            console.log(query)
            const response = await fetch(
                `http://localhost:5001/api/clubs/${currentClub.club_id}/expenses/search?${query}&fiscal_year=${fiscal_year}`
            );

            if (response.ok) {
                const data = await response.json();
                setFilteredExpenses(data.expenses);
                console.log(data.expenses)

                if (data.expenses.length === 0) {
                    toast.info("No expenses found matching the criteria.");
                }
            } else {
                console.error("Failed to search expenses:", response.statusText);
            }
        } catch (error) {
            console.error("Error searching expenses:", error);
        } finally {
            setLoading(false);
        }
    };


    // const handleAddExpense = async () => {
    //     if (!currentClub) {
    //         toast.error("No club selected.");
    //         return;
    //     }

    //     try {
    //         const response = await fetch(
    //             `http://localhost:5001/api/clubs/${currentClub.club_id}/expenses`,
    //             {
    //                 method: "POST",
    //                 headers: { "Content-Type": "application/json" },
    //                 body: JSON.stringify(formData),
    //             }
    //         );

    //         if (response.ok) {
    //             toast.success("Expense added successfully!");
    //             setIsModalOpen(false); // Close modal
    //             setFormData({
    //                 budget_id: 0,
    //                 expense_name: "",
    //                 expense_amount: "",
    //                 expense_date: "",
    //                 description: "",
    //                 category: "",
    //             }); // Reset form fields
    //             fetchExpenses(); // Refresh expenses
    //         } else {
    //             const errorData = await response.json();
    //             toast.error(errorData.error || "Failed to add expense.");
    //         }
    //     } catch (error) {
    //         console.error("Error adding expense:", error);
    //         toast.error("An error occurred while adding the expense.");
    //     }
    // };

    const handleAddExpense = async () => {
        if (!currentClub || !budget) {
            toast.error("No club or budget selected.");
            return;
        }
    
        try {
            const response = await fetch(
                `http://localhost:5001/api/clubs/${currentClub.club_id}/expenses`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                }
            );
    
            if (response.ok) {
                const addedExpense = await response.json(); // Assuming the response returns the added expense
                toast.success("Expense added successfully!");
    
                // Update budget
                const newSpentAmount = budget.spent_amount + parseFloat(formData.expense_amount);
                const newRemainingAmount = budget.total_budget - newSpentAmount;
    
                setBudget({
                    ...budget,
                    spent_amount: newSpentAmount,
                    remaining_amount: newRemainingAmount,
                });
    
                // Refresh expenses
                fetchExpenses();
                setIsModalOpen(false); // Close modal
                setFormData({
                    budget_id: 0,
                    expense_name: "",
                    expense_amount: "",
                    expense_date: "",
                    description: "",
                    category: "",
                }); // Reset form fields
            } else {
                const errorData = await response.json();
                toast.error(errorData.error || "Failed to add expense.");
            }
        } catch (error) {
            console.error("Error adding expense:", error);
            toast.error("An error occurred while adding the expense.");
        }
    };
    


    const handleRemoveExpense = (expense: Expense) => {
        setExpenseToDelete(expense); // Set expense to delete
        setIsDeleteModalOpen(true); // Open delete modal
    };

    const confirmDeleteExpense = async () => {
        if (!currentClub || !expenseToDelete || !budget) return;
    
        try {
            const response = await fetch(
                `http://localhost:5001/api/clubs/${currentClub.club_id}/expenses/${expenseToDelete.expense_id}`,
                { method: "DELETE" }
            );
    
            if (response.ok) {
                toast.success("Expense removed successfully!");
    
                // Update budget
                const newSpentAmount = budget.spent_amount - expenseToDelete.expense_amount;
                const newRemainingAmount = budget.total_budget - newSpentAmount;
    
                setBudget({
                    ...budget,
                    spent_amount: newSpentAmount,
                    remaining_amount: newRemainingAmount,
                });
    
                // Refresh expenses
                setExpenses((prev) =>
                    prev.filter((exp) => exp.expense_id !== expenseToDelete.expense_id)
                );
                setIsDeleteModalOpen(false); // Close delete modal
                setExpenseToDelete(null); // Clear selected expense
                fetchExpenses();
            } else {
                const errorData = await response.json();
                toast.error(errorData.error || "Failed to remove expense.");
            }
        } catch (error) {
            console.error("Error removing expense:", error);
            toast.error("An error occurred while removing the expense.");
        }
    };
    

    useEffect(() => {
        fetchExpenses();
    }, [currentClub, fiscal_year]);

    const totalPages = Math.ceil(filteredExpenses.length / ITEMS_PER_PAGE);

    const paginatedExpenses = filteredExpenses.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div className="p-4 bg-white rounded shadow text-black">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Expenses for {fiscal_year}</h2>
                <button
                    className="bg-cms_soft_teal font-bold text-white px-4 py-2 rounded hover:bg-cyan-700"
                    onClick={() => setIsModalOpen(true)}
                >
                    Add Expense
                </button>
            </div>

            {/* Search Fields */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mb-4">
                <input
                    type="text"
                    name="expense_name"
                    value={searchParams.expense_name}
                    onChange={handleSearchInputChange}
                    placeholder="Expense Name"
                    className="px-4 py-2 border rounded"
                />
                <input
                    type="date"
                    name="expense_date"
                    value={searchParams.expense_date}
                    onChange={handleSearchInputChange}
                    placeholder="Expense Date"
                    className="px-4 py-2 border rounded"
                />
                <input
                    type="text"
                    name="category"
                    value={searchParams.category}
                    onChange={handleSearchInputChange}
                    placeholder="Category"
                    className="px-4 py-2 border rounded"
                />
            </div>
            <div className="mt-2 mb-4">
                <button
                    onClick={handleSearch}
                    className="bg-cms_soft_teal text-white px-4 py-2 rounded hover:bg-cyan-700 font-bold"
                >
                    Search
                </button>
            </div>

            {loading ? (
                <p>Loading expenses...</p>
            ) : paginatedExpenses.length > 0 ? (
                <>
                    <table className="table-auto w-full border">
                        <thead>
                            <tr>
                                <th className="border px-4 py-2 text-left bg-cms_light_purple">Name</th>
                                <th className="border px-4 py-2 text-left bg-cms_light_purple">Amount</th>
                                <th className="border px-4 py-2 text-left bg-cms_light_purple">Date</th>
                                <th className="border px-4 py-2 text-left bg-cms_light_purple">Category</th>
                                <th className="border px-4 py-2 text-left bg-cms_light_purple">Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedExpenses.map((expense) => (
                                <tr key={expense.expense_id}>
                                    <td className="border px-4 py-2 flex items-center justify-between group">
                                        <span>{expense.expense_name}</span>
                                        <button
                                            onClick={() => handleRemoveExpense(expense)}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-red-500 hover:text-red-700 ml-2"
                                            title="Remove Expense"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="currentColor"
                                                className="w-5 h-5"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M9 3a3 3 0 00-3 3v1H4.5a.75.75 0 000 1.5h15a.75.75 0 000-1.5H18V6a3 3 0 00-3-3H9zM6.75 7.5v12a2.25 2.25 0 002.25 2.25h6a2.25 2.25 0 002.25-2.25v-12H6.75zm3 3a.75.75 0 011.5 0v6a.75.75 0 01-1.5 0v-6zm4.5 0a.75.75 0 011.5 0v6a.75.75 0 01-1.5 0v-6z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </button>
                                    </td>
                                    <td className="border px-4 py-2">${expense.expense_amount.toFixed(2)}</td>
                                    <td className="border px-4 py-2">{expense.expense_date}</td>
                                    <td className="border px-4 py-2">{expense.category || "N/A"}</td>
                                    <td className="border px-4 py-2">{expense.description || "N/A"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="flex justify-center mt-4">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`px-3 py-1 border rounded ${currentPage === page
                                        ? "bg-cms_purple text-white"
                                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                                    }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                </>

            ) : (
                <p>No expenses found for the {fiscal_year} fiscal year.</p>
            )}

            {/* Add Expense Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-cms_purple rounded-lg shadow-lg p-6 w-96">
                        <h2 className="text-lg font-bold mb-4 text-white">Add New Expense</h2>
                        <form className="space-y-4">
                            <input
                                type="text"
                                name="expense_name"
                                value={formData.expense_name}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, expense_name: e.target.value }))
                                }
                                placeholder="Expense Name"
                                className="w-full px-3 py-2 border rounded"
                                required
                            />
                            <input
                                type="number"
                                name="expense_amount"
                                value={formData.expense_amount}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, expense_amount: e.target.value }))
                                }
                                placeholder="Expense Amount"
                                className="w-full px-3 py-2 border rounded"
                                required
                            />
                            <input
                                type="date"
                                name="expense_date"
                                value={formData.expense_date}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, expense_date: e.target.value }))
                                }
                                className="w-full px-3 py-2 border rounded"
                                required
                            />
                            {/* <input
                                type="text"
                                name="category"
                                value={formData.category}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, category: e.target.value }))
                                }
                                placeholder="Category"
                                className="w-full px-3 py-2 border rounded"
                            /> */}
                            <select
                                name="category"
                                value={formData.category}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, category: e.target.value }))
                                }
                                className="w-full px-3 py-2 border rounded"
                            >
                                <option value="">Select a category</option>
                                {categories.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, description: e.target.value }))
                                }
                                placeholder="Description"
                                className="w-full px-3 py-2 border rounded"
                            />
                        </form>
                        <div className="mt-4 flex justify-between">
                            <button
                                className="bg-cms_accept text-white px-4 py-2 rounded hover:bg-green-600"
                                onClick={handleAddExpense}
                            >
                                Submit
                            </button>
                            <button
                                className="bg-cms_deny text-white px-4 py-2 rounded hover:bg-red-600"
                                onClick={() => {
                                    setIsModalOpen(false); // Close the modal
                                    setFormData({
                                        budget_id: 0,
                                        expense_name: "",
                                        expense_amount: "",
                                        expense_date: "",
                                        description: "",
                                        category: "",
                                    }); // Reset the form fields
                                }}
                            >
                                Cancel
                            </button>

                        </div>
                    </div>
                </div>
            )}

            {/* Delete Expense Modal */}
            {isDeleteModalOpen && expenseToDelete && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                        <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
                        <p>
                            Are you sure you want to delete the expense{" "}
                            <strong>{expenseToDelete.expense_name}</strong>?
                        </p>
                        <div className="mt-4 flex justify-between">
                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                onClick={confirmDeleteExpense}
                            >
                                Delete
                            </button>
                            <button
                                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                                onClick={() => setIsDeleteModalOpen(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExpensesList;
