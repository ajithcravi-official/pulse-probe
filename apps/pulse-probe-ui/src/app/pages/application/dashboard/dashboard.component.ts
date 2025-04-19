import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

interface SentimentRow {
  name: string;
  positive: number; // Keep property name or rename to `positive`
  negative: number; // Keep or rename to `negative`
  neutral: number;
}

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  data: SentimentRow[] = [
    { name: 'Apple', positive: 12, negative: 3, neutral: 5 },
    { name: 'Google', positive: 18, negative: 2, neutral: 7 },
    { name: 'Tesla', positive: 9, negative: 6, neutral: 4 },
  ];

  filteredData = [...this.data];

  rowToDelete: number | null = null;

  searchTerm = '';

  constructor(private modalService: NgbModal) {}

  onSearch() {
    const term = this.searchTerm.toLowerCase();
    this.filteredData = this.data.filter((row) =>
      row.name.toLowerCase().includes(term)
    );
  }

  onNewClick() {
    console.log('New button clicked');
    // You can open a modal, navigate to a form, etc.
  }

  confirmDelete(modal: any, index: number) {
    this.rowToDelete = index;
    this.modalService.open(modal);
  }

  deleteConfirmed(modal: any) {
    if (this.rowToDelete !== null) {
      this.data.splice(this.rowToDelete, 1);
      this.rowToDelete = null;
    }
    modal.close();
  }
}
