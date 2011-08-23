
class WillPaginate::Collection

  def to_json(opts=nil)
    ActiveSupport::JSON.encode(as_json(opts))
  end

  def as_json(opts=nil)
    {
      :entries      => self.to_a,
      :currentPage  => self.current_page,
      :perPage      => self.per_page,
      :totalEntries => self.total_entries,
      :totalPages   => self.total_pages
    }
  end

end

