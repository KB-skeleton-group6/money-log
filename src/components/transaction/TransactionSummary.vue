<script setup>
defineProps({
  summary: {
    type: Object,
    required: true,
  },
});

const formatCurrency = (val) => new Intl.NumberFormat('ko-KR').format(val);
</script>

<template>
  <section class="summary-section">
    <div class="summary-card">
      <div class="card-icon text-blue">
        <i class="fas fa-arrow-circle-down"></i>
      </div>
      <div class="card-info">
        <div class="card-title">총 수입</div>
        <div class="card-value text-blue">+{{ formatCurrency(summary.income) }}원</div>
      </div>
    </div>

    <div class="summary-card">
      <div class="card-icon text-red">
        <i class="fas fa-arrow-circle-up"></i>
      </div>
      <div class="card-info">
        <div class="card-title">총 지출</div>
        <div class="card-value text-red">-{{ formatCurrency(summary.expense) }}원</div>
      </div>
    </div>

    <div class="summary-card">
      <div class="card-icon text-green">
        <i class="fas fa-check-circle"></i>
      </div>
      <div class="card-info">
        <div class="card-title">순이익</div>
        <div class="card-value text-green">{{ formatCurrency(summary.net) }}원</div>
      </div>
    </div>

    <div class="summary-card mini-card">
      <div class="card-icon text-gray mobile-only">
        <i class="fas fa-file-alt"></i>
      </div>
      <div class="card-info">
        <div class="card-title">검색 결과</div>
        <div class="card-value">{{ summary.count }}건</div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.summary-section {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}
.summary-card {
  flex: 1;
  background: #ffffff;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
  display: flex;
  align-items: center;
  gap: 16px;
}
.mini-card {
  flex: 0.5;
  justify-content: center;
}
.card-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  background-color: #f8fafc;
}
.card-icon.text-blue {
  background-color: #eff6ff;
}
.card-icon.text-red {
  background-color: #fef2f2;
}
.card-icon.text-green {
  background-color: #f0fdf4;
}
.card-title {
  font-size: 13px;
  color: #64748b;
  margin-bottom: 6px;
  font-weight: 600;
}
.card-value {
  font-size: 20px;
  font-weight: 800;
}
.text-blue {
  color: #3b82f6;
}
.text-red {
  color: #ef4444;
}
.text-green {
  color: #10b981;
}
.mobile-only {
  display: none;
}

@media (max-width: 768px) {
  .mobile-only {
    display: flex;
  }

  .summary-section {
    flex-direction: column;
    gap: 8px;
    margin-bottom: 16px;
  }

  .summary-card {
    padding: 12px 16px;
    flex-direction: row;
    justify-content: flex-start;
    gap: 12px;
  }

  .mini-card {
    border: 1px solid #f1f5f9;
  }

  .card-icon {
    width: 36px;
    height: 36px;
    font-size: 16px;
    flex-shrink: 0;
  }

  .text-gray {
    color: #94a3b8;
  }

  .card-info {
    min-width: 0;
    overflow: hidden;
  }

  .card-value {
    font-size: 15px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
