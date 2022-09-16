export default class BudgetTracker {
    constructor(querySelectorString) {
        this.root = document.querySelector(querySelectorString);
        this.root.innerHTML = BudgetTracker.html();

        this.root.querySelector(".new-entry").addEventListener("click", () => {
            this.onNewEntryBtnClick();
        });

        // Load initial data from Local Storage
        this.load();
    }

    static html() {
        return `
         <head text="center">
         <h2 class="text-center">FINANCE DEPARTMENT</h2>
        </head>
        <br><br>
            <table class="budget-tracker">
                <thead>
                    <tr>
                        <th>Deal ID</th>
                        <th>Date</th>
                        <th>Client_Name</th>
                        <th>Project_Name</th>
                        <th>Manager_Name</th>
                        <th>Type</th>
                        <th>Amount</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody class="entries"></tbody>
                <tbody>
                    <tr>
                            <span class="new-entry"></span>
                       
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="7" class="summary">
                            <strong>Total:</strong>
                            <span class="total">$0.00</span>
                        </td>
                    </tr>
                </tfoot>
                
            </table>
            </table>
            <div class="d-grid gap-2 col-6 mx-auto">
                    <a href="/project2/index.html" class="btn btn-outline-secondary" role="button" >Update List</a>
             </div>
        `;
    }

    static entryHtml() {
        return `
            <tr>
                <td>
                     <input class="input input-id" type="text"">
                 </td>
                <td>
                    <input class="input input-date" type="date">
                </td>
                <td>
                    <input class="input input-client" type="text" placeholder="Enter Client name">
                </td>
                <td>
                    <input class="input input-description" type="text" placeholder="Enter project name">
                </td>
                <td>
                    <input class="input input-manager" type="text" placeholder="Enter Manager name">
                </td>
                <td>
                    <select class="input input-type">
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>
                </td>
                <td>
                    <input type="number" class="input input-amount">
                </td>
                <td>
                    <button type="button" class="delete-entry">&#10005;</button>
                </td>
            </tr>
        `;
    }

    load() {
        const entries = JSON.parse(localStorage.getItem("budget-tracker-entries-dev") || "[]");

        for (const entry of entries) {
            this.addEntry(entry);
        }

        this.updateSummary();
    }

    updateSummary() {
        const total = this.getEntryRows().reduce((total, row) => {
            const amount = row.querySelector(".input-amount").value;
            const isExpense = row.querySelector(".input-type").value === "expense";
            const modifier = isExpense ? -1 : 1;

            return total + (amount * modifier);
        }, 0);

        const totalFormatted = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD"
        }).format(total);

        this.root.querySelector(".total").textContent = totalFormatted;
    }

    save() {
        const data = this.getEntryRows().map(row => {
            return {
                id:row.querySelector(".input-id").value,
                date: row.querySelector(".input-date").value,
                Name:row.querySelector(".input-client").value,
                description: row.querySelector(".input-description").value,
                manager:row.querySelector(".input-manager").value,
                type: row.querySelector(".input-type").value,
                amount: parseFloat(row.querySelector(".input-amount").value),
            };
        });

        localStorage.setItem("budget-tracker-entries-dev", JSON.stringify(data));
        this.updateSummary();
    }

    addEntry(entry = {}) {
        this.root.querySelector(".entries").insertAdjacentHTML("beforeend", BudgetTracker.entryHtml());

        const row = this.root.querySelector(".entries tr:last-of-type");

        row.querySelector(".input-id").value = entry.id || "";
        row.querySelector(".input-date").value = entry.date || new Date().toISOString().replace(/T.*/, "");
        row.querySelector(".input-client").value = entry.Name || "";
        row.querySelector(".input-description").value = entry.description || "";
        row.querySelector(".input-manager").value = entry.manager || "";
        row.querySelector(".input-type").value = entry.type || "income";
        row.querySelector(".input-amount").value = entry.amount || 0;
        row.querySelector(".delete-entry").addEventListener("click", e => {
            this.onDeleteEntryBtnClick(e);
        });

        row.querySelectorAll(".input").forEach(input => {
            input.addEventListener("change", () => this.save());
        });
    }

    getEntryRows() {
        return Array.from(this.root.querySelectorAll(".entries tr"));
    }

    onNewEntryBtnClick() {
        this.addEntry();
    }

    onDeleteEntryBtnClick(e) {
        e.target.closest("tr").remove();
        this.save();
    }
}