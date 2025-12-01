/**
* @File Name : ContactTriggerHandler.cls
* @Description :
* @Author :
* @Last Modified By :
* @Last Modified On : November 26, 2025
* @Modification Log :
*==============================================================================
* Ver | Date | Author | Modification
*==============================================================================
* 1.0 | November 26, 2025 |   | Initial Version
**/

public class ContactTriggerHandler {
	public static void handlecontacts(List<Contact> allContacts){
		//Store Account Ids
		Set<Id> accIds = new Set<Id>();

		for(Contact con : allContacts){
			accIds.add(con.AccountId);
		}

		//Store Total contacts for each account
		List<AggregateResult> arResults = [
			SELECT COUNT(Id) total,AccountId acc
			FROM Contact
			WHERE AccountId IN :accIds
			GROUP BY AccountId
		];

		Map<Id,Integer> AccMap = new Map<Id,Integer>();

		for(AggregateResult ar : arResults){
			AccMap.put((Id) ar.get('acc'),(Integer) ar.get('total'));
		}
        System.debug(AccMap);
		for(Contact c : allContacts){
			if(AccMap.get(c.AccountId) > 2){
				c.addError('Error : You cannot add more than 2 contacts on this account');
			}
		}
	}
}