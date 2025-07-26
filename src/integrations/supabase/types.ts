export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      affiliate_withdrawals: {
        Row: {
          account_details: Json | null
          agent_id: string
          created_at: string
          id: string
          processed_at: string | null
          processed_by: string | null
          processing_notes: string | null
          requested_at: string
          status: string
          transaction_reference: string | null
          updated_at: string
          withdrawal_amount: number
          withdrawal_method: string
        }
        Insert: {
          account_details?: Json | null
          agent_id: string
          created_at?: string
          id?: string
          processed_at?: string | null
          processed_by?: string | null
          processing_notes?: string | null
          requested_at?: string
          status?: string
          transaction_reference?: string | null
          updated_at?: string
          withdrawal_amount: number
          withdrawal_method: string
        }
        Update: {
          account_details?: Json | null
          agent_id?: string
          created_at?: string
          id?: string
          processed_at?: string | null
          processed_by?: string | null
          processing_notes?: string | null
          requested_at?: string
          status?: string
          transaction_reference?: string | null
          updated_at?: string
          withdrawal_amount?: number
          withdrawal_method?: string
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_withdrawals_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      agents: {
        Row: {
          agent_type: Database["public"]["Enums"]["agent_type"]
          application_notes: string | null
          approval_status: string | null
          approved_at: string | null
          approved_by: string | null
          commissions_pending: number | null
          commissions_withdrawn: number | null
          created_at: string | null
          id: string
          is_active: boolean | null
          qr_code: string | null
          referral_code: string
          rejection_reason: string | null
          total_commissions: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          agent_type?: Database["public"]["Enums"]["agent_type"]
          application_notes?: string | null
          approval_status?: string | null
          approved_at?: string | null
          approved_by?: string | null
          commissions_pending?: number | null
          commissions_withdrawn?: number | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          qr_code?: string | null
          referral_code: string
          rejection_reason?: string | null
          total_commissions?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          agent_type?: Database["public"]["Enums"]["agent_type"]
          application_notes?: string | null
          approval_status?: string | null
          approved_at?: string | null
          approved_by?: string | null
          commissions_pending?: number | null
          commissions_withdrawn?: number | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          qr_code?: string | null
          referral_code?: string
          rejection_reason?: string | null
          total_commissions?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      cms_pages: {
        Row: {
          author_id: string | null
          content: string
          created_at: string | null
          featured_image_url: string | null
          id: string
          is_featured: boolean | null
          last_modified_by: string | null
          meta_description: string | null
          meta_keywords: string | null
          page_type: string
          publish_date: string | null
          slug: string
          status: string
          title: string
          updated_at: string | null
          view_count: number | null
        }
        Insert: {
          author_id?: string | null
          content: string
          created_at?: string | null
          featured_image_url?: string | null
          id?: string
          is_featured?: boolean | null
          last_modified_by?: string | null
          meta_description?: string | null
          meta_keywords?: string | null
          page_type?: string
          publish_date?: string | null
          slug: string
          status?: string
          title: string
          updated_at?: string | null
          view_count?: number | null
        }
        Update: {
          author_id?: string | null
          content?: string
          created_at?: string | null
          featured_image_url?: string | null
          id?: string
          is_featured?: boolean | null
          last_modified_by?: string | null
          meta_description?: string | null
          meta_keywords?: string | null
          page_type?: string
          publish_date?: string | null
          slug?: string
          status?: string
          title?: string
          updated_at?: string | null
          view_count?: number | null
        }
        Relationships: []
      }
      companies: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          industry: string | null
          location: string | null
          logo_url: string | null
          name: string
          size: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          industry?: string | null
          location?: string | null
          logo_url?: string | null
          name: string
          size?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          industry?: string | null
          location?: string | null
          logo_url?: string | null
          name?: string
          size?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      competition_participants: {
        Row: {
          competition_id: string
          created_at: string | null
          id: string
          participant_name: string
          participant_phone: string
          profile_picture_url: string | null
          user_id: string
          vote_count: number | null
        }
        Insert: {
          competition_id: string
          created_at?: string | null
          id?: string
          participant_name: string
          participant_phone: string
          profile_picture_url?: string | null
          user_id: string
          vote_count?: number | null
        }
        Update: {
          competition_id?: string
          created_at?: string | null
          id?: string
          participant_name?: string
          participant_phone?: string
          profile_picture_url?: string | null
          user_id?: string
          vote_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "competition_participants_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions"
            referencedColumns: ["id"]
          },
        ]
      }
      competition_votes: {
        Row: {
          competition_id: string
          id: string
          participant_id: string
          vote_date: string | null
          voted_at: string | null
          voter_id: string
        }
        Insert: {
          competition_id: string
          id?: string
          participant_id: string
          vote_date?: string | null
          voted_at?: string | null
          voter_id: string
        }
        Update: {
          competition_id?: string
          id?: string
          participant_id?: string
          vote_date?: string | null
          voted_at?: string | null
          voter_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "competition_votes_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "competition_votes_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "competition_participants"
            referencedColumns: ["id"]
          },
        ]
      }
      competitions: {
        Row: {
          created_at: string | null
          current_entries: number | null
          description: string | null
          end_date: string
          id: string
          location: string | null
          max_entries: number | null
          prize: string | null
          start_date: string
          status: Database["public"]["Enums"]["competition_status"] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          current_entries?: number | null
          description?: string | null
          end_date: string
          id?: string
          location?: string | null
          max_entries?: number | null
          prize?: string | null
          start_date: string
          status?: Database["public"]["Enums"]["competition_status"] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          current_entries?: number | null
          description?: string | null
          end_date?: string
          id?: string
          location?: string | null
          max_entries?: number | null
          prize?: string | null
          start_date?: string
          status?: Database["public"]["Enums"]["competition_status"] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      discount_usage: {
        Row: {
          amount_saved: number | null
          discount_percentage: number | null
          id: string
          merchant_id: string
          used_at: string | null
          user_id: string
        }
        Insert: {
          amount_saved?: number | null
          discount_percentage?: number | null
          id?: string
          merchant_id: string
          used_at?: string | null
          user_id: string
        }
        Update: {
          amount_saved?: number | null
          discount_percentage?: number | null
          id?: string
          merchant_id?: string
          used_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "discount_usage_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
        ]
      }
      distributors: {
        Row: {
          address: string | null
          business_name: string | null
          business_registration_number: string | null
          city: string | null
          commission_pending: number | null
          commission_rate: number | null
          commission_withdrawn: number | null
          contact_person: string | null
          country: string | null
          created_at: string | null
          distributor_type: string
          email: string | null
          id: string
          is_active: boolean | null
          phone: string | null
          products_distributed: string[] | null
          territory_coverage: string | null
          total_commission_earned: number | null
          total_sales: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address?: string | null
          business_name?: string | null
          business_registration_number?: string | null
          city?: string | null
          commission_pending?: number | null
          commission_rate?: number | null
          commission_withdrawn?: number | null
          contact_person?: string | null
          country?: string | null
          created_at?: string | null
          distributor_type?: string
          email?: string | null
          id?: string
          is_active?: boolean | null
          phone?: string | null
          products_distributed?: string[] | null
          territory_coverage?: string | null
          total_commission_earned?: number | null
          total_sales?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address?: string | null
          business_name?: string | null
          business_registration_number?: string | null
          city?: string | null
          commission_pending?: number | null
          commission_rate?: number | null
          commission_withdrawn?: number | null
          contact_person?: string | null
          country?: string | null
          created_at?: string | null
          distributor_type?: string
          email?: string | null
          id?: string
          is_active?: boolean | null
          phone?: string | null
          products_distributed?: string[] | null
          territory_coverage?: string | null
          total_commission_earned?: number | null
          total_sales?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      job_applications: {
        Row: {
          applicant_id: string
          applied_at: string | null
          available_from: string | null
          cover_letter: string | null
          education: string | null
          email: string | null
          expected_salary: number | null
          experience_years: number | null
          full_name: string | null
          id: string
          job_id: string
          phone: string | null
          portfolio_url: string | null
          resume_url: string | null
          skills: string[] | null
          status: string | null
          work_experience: string | null
        }
        Insert: {
          applicant_id: string
          applied_at?: string | null
          available_from?: string | null
          cover_letter?: string | null
          education?: string | null
          email?: string | null
          expected_salary?: number | null
          experience_years?: number | null
          full_name?: string | null
          id?: string
          job_id: string
          phone?: string | null
          portfolio_url?: string | null
          resume_url?: string | null
          skills?: string[] | null
          status?: string | null
          work_experience?: string | null
        }
        Update: {
          applicant_id?: string
          applied_at?: string | null
          available_from?: string | null
          cover_letter?: string | null
          education?: string | null
          email?: string | null
          expected_salary?: number | null
          experience_years?: number | null
          full_name?: string | null
          id?: string
          job_id?: string
          phone?: string | null
          portfolio_url?: string | null
          resume_url?: string | null
          skills?: string[] | null
          status?: string | null
          work_experience?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      job_bookmarks: {
        Row: {
          created_at: string | null
          id: string
          job_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          job_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          job_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_bookmarks_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      job_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      jobs: {
        Row: {
          application_count: number | null
          application_deadline: string | null
          benefits: string | null
          category_id: string | null
          company: string
          company_id: string | null
          created_at: string | null
          currency: string | null
          description: string
          employment_type: string
          experience_level: string | null
          featured: boolean | null
          id: string
          is_active: boolean | null
          location: string
          posted_by: string | null
          remote_allowed: boolean | null
          requirements: string | null
          salary_max: number | null
          salary_min: number | null
          skills: string[] | null
          title: string
          updated_at: string | null
          urgent: boolean | null
          views: number | null
        }
        Insert: {
          application_count?: number | null
          application_deadline?: string | null
          benefits?: string | null
          category_id?: string | null
          company: string
          company_id?: string | null
          created_at?: string | null
          currency?: string | null
          description: string
          employment_type: string
          experience_level?: string | null
          featured?: boolean | null
          id?: string
          is_active?: boolean | null
          location: string
          posted_by?: string | null
          remote_allowed?: boolean | null
          requirements?: string | null
          salary_max?: number | null
          salary_min?: number | null
          skills?: string[] | null
          title: string
          updated_at?: string | null
          urgent?: boolean | null
          views?: number | null
        }
        Update: {
          application_count?: number | null
          application_deadline?: string | null
          benefits?: string | null
          category_id?: string | null
          company?: string
          company_id?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string
          employment_type?: string
          experience_level?: string | null
          featured?: boolean | null
          id?: string
          is_active?: boolean | null
          location?: string
          posted_by?: string | null
          remote_allowed?: boolean | null
          requirements?: string | null
          salary_max?: number | null
          salary_min?: number | null
          skills?: string[] | null
          title?: string
          updated_at?: string | null
          urgent?: boolean | null
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "jobs_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "job_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      joinies: {
        Row: {
          address: string | null
          city: string | null
          country: string | null
          created_at: string | null
          email: string
          full_name: string
          id: string
          ip_address: string | null
          membership_tier: string | null
          phone: string | null
          referral_code: string | null
          registration_source: string | null
          updated_at: string | null
          user_agent: string | null
          user_id: string
          user_type: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          email: string
          full_name: string
          id?: string
          ip_address?: string | null
          membership_tier?: string | null
          phone?: string | null
          referral_code?: string | null
          registration_source?: string | null
          updated_at?: string | null
          user_agent?: string | null
          user_id: string
          user_type?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          ip_address?: string | null
          membership_tier?: string | null
          phone?: string | null
          referral_code?: string | null
          registration_source?: string | null
          updated_at?: string | null
          user_agent?: string | null
          user_id?: string
          user_type?: string | null
        }
        Relationships: []
      }
      memberships: {
        Row: {
          created_at: string | null
          expiry_date: string | null
          id: string
          is_active: boolean | null
          member_id: string | null
          monthly_fee_current: boolean | null
          physical_card_requested: boolean | null
          qr_code: string | null
          registration_fee_paid: boolean | null
          start_date: string | null
          tier: Database["public"]["Enums"]["membership_tier"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          is_active?: boolean | null
          member_id?: string | null
          monthly_fee_current?: boolean | null
          physical_card_requested?: boolean | null
          qr_code?: string | null
          registration_fee_paid?: boolean | null
          start_date?: string | null
          tier?: Database["public"]["Enums"]["membership_tier"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          is_active?: boolean | null
          member_id?: string | null
          monthly_fee_current?: boolean | null
          physical_card_requested?: boolean | null
          qr_code?: string | null
          registration_fee_paid?: boolean | null
          start_date?: string | null
          tier?: Database["public"]["Enums"]["membership_tier"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      merchants: {
        Row: {
          business_hours: Json | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string | null
          description: string | null
          discount_percentage: number
          featured: boolean | null
          id: string
          image_url: string | null
          is_active: boolean | null
          location: string | null
          logo_url: string | null
          name: string
          rating: number | null
          sector: string
          sector_id: string | null
          social_media: Json | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          business_hours?: Json | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description?: string | null
          discount_percentage: number
          featured?: boolean | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          location?: string | null
          logo_url?: string | null
          name: string
          rating?: number | null
          sector: string
          sector_id?: string | null
          social_media?: Json | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          business_hours?: Json | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description?: string | null
          discount_percentage?: number
          featured?: boolean | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          location?: string | null
          logo_url?: string | null
          name?: string
          rating?: number | null
          sector?: string
          sector_id?: string | null
          social_media?: Json | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "merchants_sector_id_fkey"
            columns: ["sector_id"]
            isOneToOne: false
            referencedRelation: "sectors"
            referencedColumns: ["id"]
          },
        ]
      }
      partners: {
        Row: {
          contact_email: string | null
          contact_phone: string | null
          created_at: string | null
          description: string | null
          featured: boolean | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          name: string
          partnership_type: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description?: string | null
          featured?: boolean | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name: string
          partnership_type?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description?: string | null
          featured?: boolean | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name?: string
          partnership_type?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      payday_advances: {
        Row: {
          approval_date: string | null
          approved_by: string | null
          collateral_description: string | null
          collateral_type: string | null
          created_at: string | null
          disbursement_method: string | null
          due_date: string
          id: string
          interest_rate: number
          loan_amount: number
          loan_date: string | null
          loan_term_days: number
          notes: string | null
          repayment_amount: number
          repayment_date: string | null
          repayment_method: string | null
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          approval_date?: string | null
          approved_by?: string | null
          collateral_description?: string | null
          collateral_type?: string | null
          created_at?: string | null
          disbursement_method?: string | null
          due_date: string
          id?: string
          interest_rate?: number
          loan_amount: number
          loan_date?: string | null
          loan_term_days?: number
          notes?: string | null
          repayment_amount: number
          repayment_date?: string | null
          repayment_method?: string | null
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          approval_date?: string | null
          approved_by?: string | null
          collateral_description?: string | null
          collateral_type?: string | null
          created_at?: string | null
          disbursement_method?: string | null
          due_date?: string
          id?: string
          interest_rate?: number
          loan_amount?: number
          loan_date?: string | null
          loan_term_days?: number
          notes?: string | null
          repayment_amount?: number
          repayment_date?: string | null
          repayment_method?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          membership_id: string | null
          payment_method: string
          payment_type: string
          receipt_sent: boolean | null
          status: Database["public"]["Enums"]["payment_status"] | null
          transaction_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          membership_id?: string | null
          payment_method: string
          payment_type: string
          receipt_sent?: boolean | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          transaction_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          membership_id?: string | null
          payment_method?: string
          payment_type?: string
          receipt_sent?: boolean | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          transaction_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_membership_id_fkey"
            columns: ["membership_id"]
            isOneToOne: false
            referencedRelation: "memberships"
            referencedColumns: ["id"]
          },
        ]
      }
      product_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          category: string
          condition: string
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          currency: string
          description: string
          discount_percentage: number | null
          id: string
          images: Json | null
          is_active: boolean
          is_sold: boolean
          location: string | null
          original_price: number | null
          posting_fee_amount: number
          posting_fee_paid: boolean
          posting_fee_payment_id: string | null
          price: number
          title: string
          updated_at: string
          user_id: string
          views: number
        }
        Insert: {
          category: string
          condition?: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          currency?: string
          description: string
          discount_percentage?: number | null
          id?: string
          images?: Json | null
          is_active?: boolean
          is_sold?: boolean
          location?: string | null
          original_price?: number | null
          posting_fee_amount?: number
          posting_fee_paid?: boolean
          posting_fee_payment_id?: string | null
          price: number
          title: string
          updated_at?: string
          user_id: string
          views?: number
        }
        Update: {
          category?: string
          condition?: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          currency?: string
          description?: string
          discount_percentage?: number | null
          id?: string
          images?: Json | null
          is_active?: boolean
          is_sold?: boolean
          location?: string | null
          original_price?: number | null
          posting_fee_amount?: number
          posting_fee_paid?: boolean
          posting_fee_payment_id?: string | null
          price?: number
          title?: string
          updated_at?: string
          user_id?: string
          views?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          city: string | null
          country: string | null
          created_at: string | null
          full_name: string
          id: string
          phone: string | null
          profile_image_url: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          full_name: string
          id: string
          phone?: string | null
          profile_image_url?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          full_name?: string
          id?: string
          phone?: string | null
          profile_image_url?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      project_contributions: {
        Row: {
          amount: number
          contributor_email: string | null
          contributor_id: string | null
          contributor_name: string | null
          created_at: string
          currency: string
          id: string
          is_anonymous: boolean
          message: string | null
          payment_method: string
          project_id: string
          status: string
          transaction_id: string | null
        }
        Insert: {
          amount: number
          contributor_email?: string | null
          contributor_id?: string | null
          contributor_name?: string | null
          created_at?: string
          currency?: string
          id?: string
          is_anonymous?: boolean
          message?: string | null
          payment_method: string
          project_id: string
          status?: string
          transaction_id?: string | null
        }
        Update: {
          amount?: number
          contributor_email?: string | null
          contributor_id?: string | null
          contributor_name?: string | null
          created_at?: string
          currency?: string
          id?: string
          is_anonymous?: boolean
          message?: string | null
          payment_method?: string
          project_id?: string
          status?: string
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_contributions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_funding"
            referencedColumns: ["id"]
          },
        ]
      }
      project_funding: {
        Row: {
          category: string
          created_at: string
          created_by: string | null
          currency: string
          current_amount: number
          description: string
          end_date: string
          goal_amount: number
          id: string
          image_url: string | null
          location: string | null
          project_name: string
          start_date: string
          status: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          created_by?: string | null
          currency?: string
          current_amount?: number
          description: string
          end_date: string
          goal_amount: number
          id?: string
          image_url?: string | null
          location?: string | null
          project_name: string
          start_date?: string
          status?: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string | null
          currency?: string
          current_amount?: number
          description?: string
          end_date?: string
          goal_amount?: number
          id?: string
          image_url?: string | null
          location?: string | null
          project_name?: string
          start_date?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          agent_id: string
          commission_amount: number
          commission_paid: boolean | null
          created_at: string | null
          id: string
          referred_user_id: string
        }
        Insert: {
          agent_id: string
          commission_amount: number
          commission_paid?: boolean | null
          created_at?: string | null
          id?: string
          referred_user_id: string
        }
        Update: {
          agent_id?: string
          commission_amount?: number
          commission_paid?: boolean | null
          created_at?: string | null
          id?: string
          referred_user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "referrals_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      rescue_requests: {
        Row: {
          admin_notes: string | null
          created_at: string
          id: string
          processed_date: string | null
          request_date: string
          request_description: string
          rescue_value_fcfa: number
          status: Database["public"]["Enums"]["rescue_status"]
          subscription_id: string
          token_balance_at_request: number
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          id?: string
          processed_date?: string | null
          request_date?: string
          request_description: string
          rescue_value_fcfa: number
          status?: Database["public"]["Enums"]["rescue_status"]
          subscription_id: string
          token_balance_at_request: number
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          id?: string
          processed_date?: string | null
          request_date?: string
          request_description?: string
          rescue_value_fcfa?: number
          status?: Database["public"]["Enums"]["rescue_status"]
          subscription_id?: string
          token_balance_at_request?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rescue_requests_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "secours_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      secours_subscriptions: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          last_rescue_claim_date: string | null
          last_token_purchase_date: string | null
          subscription_date: string
          subscription_type: Database["public"]["Enums"]["secours_type"]
          token_balance: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          last_rescue_claim_date?: string | null
          last_token_purchase_date?: string | null
          subscription_date?: string
          subscription_type: Database["public"]["Enums"]["secours_type"]
          token_balance?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          last_rescue_claim_date?: string | null
          last_token_purchase_date?: string | null
          subscription_date?: string
          subscription_type?: Database["public"]["Enums"]["secours_type"]
          token_balance?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      sectors: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      shop_offers: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          discount_percentage: number
          id: string
          image_url: string | null
          is_active: boolean
          premium_only: boolean
          title: string
          updated_at: string
          valid_until: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          discount_percentage?: number
          id?: string
          image_url?: string | null
          is_active?: boolean
          premium_only?: boolean
          title: string
          updated_at?: string
          valid_until: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          discount_percentage?: number
          id?: string
          image_url?: string | null
          is_active?: boolean
          premium_only?: boolean
          title?: string
          updated_at?: string
          valid_until?: string
        }
        Relationships: []
      }
      token_transactions: {
        Row: {
          created_at: string
          id: string
          payment_method: string | null
          subscription_id: string
          token_amount: number
          token_value_fcfa: number
          transaction_reference: string | null
          transaction_type: Database["public"]["Enums"]["token_transaction_type"]
        }
        Insert: {
          created_at?: string
          id?: string
          payment_method?: string | null
          subscription_id: string
          token_amount: number
          token_value_fcfa: number
          transaction_reference?: string | null
          transaction_type: Database["public"]["Enums"]["token_transaction_type"]
        }
        Update: {
          created_at?: string
          id?: string
          payment_method?: string | null
          subscription_id?: string
          token_amount?: number
          token_value_fcfa?: number
          transaction_reference?: string | null
          transaction_type?: Database["public"]["Enums"]["token_transaction_type"]
        }
        Relationships: [
          {
            foreignKeyName: "token_transactions_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "secours_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_education: {
        Row: {
          created_at: string | null
          degree: string
          end_date: string | null
          field_of_study: string | null
          grade: string | null
          id: string
          institution: string
          is_current: boolean | null
          start_date: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          degree: string
          end_date?: string | null
          field_of_study?: string | null
          grade?: string | null
          id?: string
          institution: string
          is_current?: boolean | null
          start_date: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          degree?: string
          end_date?: string | null
          field_of_study?: string | null
          grade?: string | null
          id?: string
          institution?: string
          is_current?: boolean | null
          start_date?: string
          user_id?: string
        }
        Relationships: []
      }
      user_experience: {
        Row: {
          company_name: string
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string
          is_current: boolean | null
          position: string
          start_date: string
          user_id: string
        }
        Insert: {
          company_name: string
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          is_current?: boolean | null
          position: string
          start_date: string
          user_id: string
        }
        Update: {
          company_name?: string
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          is_current?: boolean | null
          position?: string
          start_date?: string
          user_id?: string
        }
        Relationships: []
      }
      user_skills: {
        Row: {
          created_at: string | null
          experience_level: string | null
          id: string
          skill_name: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          experience_level?: string | null
          id?: string
          skill_name: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          experience_level?: string | null
          id?: string
          skill_name?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_member_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_referral_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_min_max_tokens: {
        Args: { sub_type: Database["public"]["Enums"]["secours_type"] }
        Returns: {
          min_tokens: number
          max_tokens: number
          min_value_fcfa: number
          max_value_fcfa: number
        }[]
      }
      get_token_value: {
        Args: { sub_type: Database["public"]["Enums"]["secours_type"] }
        Returns: number
      }
      increment_competition_entries: {
        Args: { competition_id: string }
        Returns: undefined
      }
      increment_job_views: {
        Args: { job_id: string }
        Returns: undefined
      }
      increment_product_views: {
        Args: { product_id: string }
        Returns: undefined
      }
      increment_vote_count: {
        Args: { participant_id: string }
        Returns: undefined
      }
    }
    Enums: {
      agent_type: "individual" | "business" | "organization"
      competition_status: "upcoming" | "active" | "completed" | "cancelled"
      membership_tier: "essential" | "premium" | "vip"
      payment_status: "pending" | "completed" | "failed" | "refunded"
      rescue_status: "pending" | "approved" | "rejected" | "completed"
      secours_type:
        | "motors"
        | "cata_catanis"
        | "auto"
        | "telephone"
        | "school_fees"
      token_transaction_type: "purchase" | "rescue_claim" | "refund"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      agent_type: ["individual", "business", "organization"],
      competition_status: ["upcoming", "active", "completed", "cancelled"],
      membership_tier: ["essential", "premium", "vip"],
      payment_status: ["pending", "completed", "failed", "refunded"],
      rescue_status: ["pending", "approved", "rejected", "completed"],
      secours_type: [
        "motors",
        "cata_catanis",
        "auto",
        "telephone",
        "school_fees",
      ],
      token_transaction_type: ["purchase", "rescue_claim", "refund"],
    },
  },
} as const
