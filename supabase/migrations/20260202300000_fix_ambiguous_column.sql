-- Fix ambiguous column reference by using explicit aliases
DROP FUNCTION IF EXISTS calculate_employee_hourly_cost(UUID);

CREATE FUNCTION calculate_employee_hourly_cost(p_employee_id UUID)
RETURNS TABLE (
  monthly_cost NUMERIC,
  full_monthly_cost NUMERIC,
  yearly_cost NUMERIC,
  daily_cost NUMERIC,
  hourly_cost NUMERIC,
  working_days_per_year INTEGER,
  asset_depreciation_monthly NUMERIC,
  overhead_share NUMERIC,
  benefits_cost NUMERIC,
  working_hours_per_day INTEGER,
  working_days_per_week INTEGER
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
  v_hours_per_day INTEGER := 8;
  v_days_per_week INTEGER := 5;
  v_public_holidays INTEGER := 0;
  v_current_year INTEGER;
  v_base_working_days INTEGER;
BEGIN
  v_current_year := EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER;

  -- Get settings from company_settings
  SELECT
    COALESCE(cs.working_hours_per_day, 8),
    COALESCE(cs.working_days_per_week, 5)
  INTO v_hours_per_day, v_days_per_week
  FROM company_settings cs
  LIMIT 1;

  -- Set defaults if no row found
  v_hours_per_day := COALESCE(v_hours_per_day, 8);
  v_days_per_week := COALESCE(v_days_per_week, 5);

  v_base_working_days := v_days_per_week * 52;

  -- Count public holidays
  SELECT COALESCE(COUNT(*), 0)::INTEGER
  INTO v_public_holidays
  FROM holidays h
  WHERE h.year = v_current_year;

  -- Get employee data
  SELECT
    COALESCE(e.base_salary, 0),
    COALESCE(e.compensation, 0),
    COALESCE(e.insurance, 0),
    COALESCE(e.ticket_value, 0),
    COALESCE(e.visa_cost, 0),
    COALESCE(e.vacation_days, 0)
  INTO
    v_base_salary, v_compensation, v_insurance,
    v_ticket_value, v_visa_cost, v_vacation_days
  FROM employees e
  WHERE e.id = p_employee_id;

  v_benefits_cost := (v_insurance / 12) + (v_ticket_value / 12) + (v_visa_cost / 24) + (v_base_salary / 12);

  SELECT COALESCE(SUM(a.depreciation_per_year / 12), 0)
  INTO v_asset_depreciation_monthly
  FROM assets a
  WHERE a.assigned_to = p_employee_id;

  v_monthly_cost := v_base_salary + v_compensation + v_benefits_cost + v_asset_depreciation_monthly;

  SELECT COALESCE(SUM(
    CASE WHEN oc.frequency = 'monthly' THEN oc.amount
         WHEN oc.frequency = 'yearly' THEN oc.amount / 12
         ELSE 0 END
  ), 0)
  INTO v_total_monthly_overhead
  FROM overhead_costs oc
  WHERE oc.active = true;

  SELECT COUNT(*) INTO v_active_employee_count FROM employees emp WHERE emp.active = true;

  IF v_active_employee_count > 0 THEN
    v_overhead_share := v_total_monthly_overhead / v_active_employee_count;
  ELSE
    v_overhead_share := 0;
  END IF;

  v_full_monthly_cost := v_monthly_cost + v_overhead_share;
  v_yearly_cost := v_full_monthly_cost * 12;
  v_working_days_per_year := v_base_working_days - v_vacation_days - v_public_holidays;

  IF v_working_days_per_year > 0 THEN
    v_daily_cost := v_yearly_cost / v_working_days_per_year;
  ELSE
    v_daily_cost := 0;
  END IF;

  IF v_hours_per_day > 0 THEN
    v_hourly_cost := v_daily_cost / v_hours_per_day;
  ELSE
    v_hourly_cost := 0;
  END IF;

  -- Return with explicit column names to avoid ambiguity
  monthly_cost := ROUND(v_monthly_cost, 2);
  full_monthly_cost := ROUND(v_full_monthly_cost, 2);
  yearly_cost := ROUND(v_yearly_cost, 2);
  daily_cost := ROUND(v_daily_cost, 2);
  hourly_cost := ROUND(v_hourly_cost, 2);
  working_days_per_year := v_working_days_per_year;
  asset_depreciation_monthly := ROUND(v_asset_depreciation_monthly, 2);
  overhead_share := ROUND(v_overhead_share, 2);
  benefits_cost := ROUND(v_benefits_cost, 2);
  working_hours_per_day := v_hours_per_day;
  working_days_per_week := v_days_per_week;
  RETURN NEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
