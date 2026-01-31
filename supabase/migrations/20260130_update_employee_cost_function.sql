-- Update employee hourly cost calculation to include compensation, overhead_share, and benefits_cost
-- Drop existing function first since return type changed
DROP FUNCTION IF EXISTS calculate_employee_hourly_cost(UUID);

CREATE OR REPLACE FUNCTION calculate_employee_hourly_cost(p_employee_id UUID)
RETURNS TABLE (
  monthly_cost NUMERIC,
  full_monthly_cost NUMERIC,
  yearly_cost NUMERIC,
  daily_cost NUMERIC,
  hourly_cost NUMERIC,
  working_days_per_year INTEGER,
  asset_depreciation_monthly NUMERIC,
  overhead_share NUMERIC,
  benefits_cost NUMERIC
) AS $$
DECLARE
  v_base_salary NUMERIC;
  v_compensation NUMERIC;
  v_insurance NUMERIC;
  v_ticket_value NUMERIC;
  v_visa_cost NUMERIC;
  v_vacation_days INTEGER;
  v_benefits_cost NUMERIC;
  v_asset_depreciation_monthly NUMERIC;
  v_monthly_cost NUMERIC;
  v_total_monthly_overhead NUMERIC;
  v_active_employee_count INTEGER;
  v_overhead_share NUMERIC;
  v_full_monthly_cost NUMERIC;
  v_yearly_cost NUMERIC;
  v_working_days_per_year INTEGER;
  v_daily_cost NUMERIC;
  v_hourly_cost NUMERIC;
  v_working_hours_per_day INTEGER := 8;
  v_public_holidays INTEGER := 13;
BEGIN
  -- Get employee data
  SELECT
    COALESCE(e.base_salary, 0),
    COALESCE(e.compensation, 0),
    COALESCE(e.insurance, 0),
    COALESCE(e.ticket_value, 0),
    COALESCE(e.visa_cost, 0),
    COALESCE(e.vacation_days, 0)
  INTO
    v_base_salary,
    v_compensation,
    v_insurance,
    v_ticket_value,
    v_visa_cost,
    v_vacation_days
  FROM employees e
  WHERE e.id = p_employee_id;

  -- Calculate benefits cost (monthly): insurance/12 + ticket/12 + visa/24 + 13th month
  v_benefits_cost := (v_insurance / 12) + (v_ticket_value / 12) + (v_visa_cost / 24) + (v_base_salary / 12);

  -- Calculate asset depreciation (monthly)
  SELECT COALESCE(SUM(a.depreciation_per_year / 12), 0)
  INTO v_asset_depreciation_monthly
  FROM assets a
  WHERE a.assigned_to = p_employee_id;

  -- Monthly Cost = Base Salary + Compensation + Benefits + Asset Depreciation
  v_monthly_cost := v_base_salary + v_compensation + v_benefits_cost + v_asset_depreciation_monthly;

  -- Calculate total monthly overhead from overhead_costs table
  SELECT COALESCE(SUM(
    CASE
      WHEN frequency = 'monthly' THEN amount
      WHEN frequency = 'yearly' THEN amount / 12
      ELSE 0
    END
  ), 0)
  INTO v_total_monthly_overhead
  FROM overhead_costs;

  -- Count active employees
  SELECT COUNT(*)
  INTO v_active_employee_count
  FROM employees
  WHERE active = true;

  -- Calculate overhead share per employee
  IF v_active_employee_count > 0 THEN
    v_overhead_share := v_total_monthly_overhead / v_active_employee_count;
  ELSE
    v_overhead_share := 0;
  END IF;

  -- Full Monthly Cost = Monthly Cost + Overhead Share
  v_full_monthly_cost := v_monthly_cost + v_overhead_share;

  -- Yearly Cost
  v_yearly_cost := v_full_monthly_cost * 12;

  -- Working days per year: 260 - vacation days - public holidays
  v_working_days_per_year := 260 - v_vacation_days - v_public_holidays;

  -- Daily Cost
  IF v_working_days_per_year > 0 THEN
    v_daily_cost := v_yearly_cost / v_working_days_per_year;
  ELSE
    v_daily_cost := 0;
  END IF;

  -- Hourly Cost
  v_hourly_cost := v_daily_cost / v_working_hours_per_day;

  RETURN QUERY SELECT
    ROUND(v_monthly_cost, 2),
    ROUND(v_full_monthly_cost, 2),
    ROUND(v_yearly_cost, 2),
    ROUND(v_daily_cost, 2),
    ROUND(v_hourly_cost, 2),
    v_working_days_per_year,
    ROUND(v_asset_depreciation_monthly, 2),
    ROUND(v_overhead_share, 2),
    ROUND(v_benefits_cost, 2);
END;
$$ LANGUAGE plpgsql;
