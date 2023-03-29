let categories = JSON.parse(localStorage.getItem('categories') || '[]');

function displayCategories() {
    const categoryTable = document.getElementById('categoryTable');
    categoryTable.innerHTML = '';

    categories.forEach((category, index) => {
        const row = document.createElement('tr');

        const categoryCell = document.createElement('td');
        categoryCell.textContent = category;
        row.appendChild(categoryCell);

        const actionsCell = document.createElement('td');
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', () => editCategory(index));
        actionsCell.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => deleteCategory(index));
        actionsCell.appendChild(deleteButton);

        row.appendChild(actionsCell);
        categoryTable.appendChild(row);
    });
}

function addCategory() {
    const category = prompt('Enter a new category:');
    if (category && category.trim()) {
        categories.push(category.trim());
        localStorage.setItem('categories', JSON.stringify(categories));
        displayCategories();
    }
}

function editCategory(index) {
    const category = prompt('Edit category:', categories[index]);
    if (category && category.trim()) {
        categories[index] = category.trim();
        localStorage.setItem('categories', JSON.stringify(categories));
        displayCategories();
    }
}

function deleteCategory(index) {
    if (confirm('Are you sure you want to delete this category?')) {
        categories.splice(index, 1);
        localStorage.setItem('categories', JSON.stringify(categories));
        displayCategories();
    }
}

document.getElementById('addCategoryBtn').addEventListener('click', addCategory);
displayCategories();
