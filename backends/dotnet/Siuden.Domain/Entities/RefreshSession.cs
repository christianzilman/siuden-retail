namespace Siuden.Domain.Entities;

public sealed class RefreshSession : AuditableEntity<Guid>
{
    public Guid UserId { get; set; }
    public Guid AccountId { get; set; }
    public Guid TenantId { get; set; }
    public Guid? CustomerId { get; set; }
    public Guid FamilyId { get; set; }
    public string RoleCode { get; set; } = string.Empty;
    public string TokenHash { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
    public DateTime? RevokedAt { get; set; }
    public Guid? ReplacedBySessionId { get; set; }
}
